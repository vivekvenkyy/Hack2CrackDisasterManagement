from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.prediction import (
    load_and_prepare_data,
    calculate_disaster_probability,
    predict_future_disasters,
    generate_graphs
)
import traceback
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier  # or your preferred model
import joblib
import xgboost as xgb  # Add XGBoost import
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import BertTokenizer, BertModel
from torch import nn
import json
import os
import praw
from datetime import datetime, timedelta, timezone
import logging
from visualizations import (
    generate_word_cloud,
    generate_time_series,
    generate_sentiment_analysis,
    generate_subreddit_distribution,
    image_to_base64
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Enable CORS for all domains (for development)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/disaster-predictions', methods=['POST'])
def get_predictions():
    try:
        data = request.json
        if not data:
            return jsonify({'message': 'No input data provided'}), 400

        country = data.get('country')
        year = data.get('year')

        if not country or not year:
            return jsonify({'message': 'Country and year are required'}), 400

        # Load and prepare data
        df = load_and_prepare_data()
        
        # Calculate probabilities
        probabilities = calculate_disaster_probability(df)
        
        # Generate predictions
        predictions_df = predict_future_disasters(probabilities)
        
        # Filter predictions for the specified country and year
        filtered_predictions = predictions_df[
            (predictions_df['Country'] == country) & 
            (predictions_df['Year'] == year)
        ]

        if filtered_predictions.empty:
            return jsonify({
                'message': f'No predictions found for {country} in year {year}',
                'predictions': [],
                'graphs': []
            }), 200
        
        # Format predictions for frontend
        predictions = []
        for _, row in filtered_predictions.iterrows():
            predictions.append({
                'disasterType': row['Disaster_Type'],
                'probability': float(row['Probability'] * 100),
                'riskLevel': row['Risk_Level']
            })
        
        # Generate graphs
        graphs = generate_graphs(predictions_df, country)
        
        return jsonify({
            'predictions': predictions,
            'graphs': graphs
        })

    except Exception as e:
        print('Error:', str(e))
        print(traceback.format_exc())  # Print the full traceback
        return jsonify({'message': f'Server error: {str(e)}'}), 500

# Add this route to test if the API is running
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

# Load the saved XGBoost model
try:
    flood_model = joblib.load('models/xgboost_flood_model.pkl')
    print("XGBoost model loaded successfully")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    traceback.print_exc()

@app.route('/api/predict-flood', methods=['POST'])
def predict_flood():
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data received'}), 400

        # Create DataFrame with the input data
        input_data = pd.DataFrame({
            feature: [float(data[feature])] for feature in data.keys()
        })
        
        # For XGBoost models, we need to convert to DMatrix
        dmatrix = xgb.DMatrix(input_data)
        
        # Make prediction
        prediction = flood_model.predict(dmatrix)[0]
        
        return jsonify({'prediction': float(prediction)})
    except Exception as e:
        logger.error(f"Error in predict_flood: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Reddit API Credentials
reddit_credentials = {
    'client_id': '1jMVeE7ePBXVJdDS9mgwaA',
    'client_secret': 'X7nvjX3RYbNGtbhNbVA4g_VF-plJjA',
    'user_agent': 'DisasterMonitor/1.0'
}

class TweetDataset(Dataset):
    def __init__(self, texts, targets=None, max_length=128):
        self.texts = texts
        self.targets = targets
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        self.max_length = max_length

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = str(self.texts[idx])
        encoding = self.tokenizer.encode_plus(
            text,
            add_special_tokens=True,
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )

        item = {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten()
        }

        if self.targets is not None:
            item['target'] = torch.tensor(self.targets[idx], dtype=torch.float)

        return item

class DisasterClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.bert = BertModel.from_pretrained('bert-base-uncased')
        self.dropout = nn.Dropout(0.1)
        self.fc1 = nn.Linear(768, 128)
        self.fc2 = nn.Linear(128, 1)
        self.relu = nn.ReLU()

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        pooled_output = outputs.pooler_output
        x = self.dropout(pooled_output)
        x = self.fc1(x)
        x = self.relu(x)
        x = self.dropout(x)
        x = self.fc2(x)
        return torch.sigmoid(x)

# Initialize Reddit monitor and model
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
reddit_monitor = None

try:
    reddit = praw.Reddit(**reddit_credentials)
    logger.info("Reddit API initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Reddit API: {str(e)}")

@app.route('/api/reddit-disasters', methods=['GET'])
def get_reddit_disasters():
    try:
        # Updated list of active subreddits
        disaster_subreddits = [
            'weather',
            'NaturalDisaster',
            'worldnews',
            'environment',
            'climate',
            'news'
        ]
        
        hours_back = int(request.args.get('hours', 24))
        
        # Use timezone-aware datetime
        cutoff_time = datetime.now(timezone.utc) - timedelta(hours=hours_back)
        
        posts = []
        disaster_keywords = [
            'earthquake', 'tsunami', 'flood', 'hurricane', 'tornado',
            'wildfire', 'volcanic', 'landslide', 'storm', 'cyclone',
            'typhoon', 'avalanche', 'mudslide', 'drought', 'disaster'
        ]

        for subreddit_name in disaster_subreddits:
            try:
                subreddit = reddit.subreddit(subreddit_name)
                
                # Fetch posts and filter by keywords
                for post in subreddit.new(limit=50):  # Increased limit for better filtering
                    post_time = datetime.fromtimestamp(post.created_utc, tz=timezone.utc)
                    
                    # Skip old posts
                    if post_time < cutoff_time:
                        continue
                        
                    # Check if post contains disaster-related keywords
                    combined_text = f"{post.title.lower()} {post.selftext.lower()}"
                    if any(keyword in combined_text for keyword in disaster_keywords):
                        posts.append({
                            'subreddit': subreddit_name,
                            'title': post.title,
                            'text': post.selftext[:500] if post.selftext else '',  # Limit text length
                            'url': post.url,
                            'created_utc': post_time.strftime('%Y-%m-%d %H:%M:%S UTC'),
                            'score': post.score,
                            'num_comments': post.num_comments
                        })
                
                logger.info(f"Successfully fetched posts from r/{subreddit_name}")
                
            except Exception as e:
                logger.error(f"Error fetching from r/{subreddit_name}: {str(e)}")
                continue
        
        # Sort posts by creation time (newest first)
        posts.sort(key=lambda x: x['created_utc'], reverse=True)
        
        # Limit to 20 most recent posts
        posts = posts[:20]
        
        return jsonify({
            'success': True,
            'posts': posts,
            'total_posts': len(posts),
            'subreddits_checked': disaster_subreddits
        })
        
    except Exception as e:
        logger.error(f"Error in get_reddit_disasters: {str(e)}")
        return jsonify({
            'success': False, 
            'error': str(e),
            'subreddits_checked': disaster_subreddits
        }), 500

@app.route('/api/fetch-and-analyze', methods=['POST'])
def fetch_and_analyze():
    try:
        data = request.json
        keywords = data.get('keywords', [])
        hours_back = data.get('hours_back', 24)

        if not keywords:
            return jsonify({
                'success': False,
                'error': 'No keywords provided'
            }), 400

        # Fetch posts from Reddit
        posts = []
        cutoff_time = datetime.now(timezone.utc) - timedelta(hours=hours_back)

        for subreddit_name in ['news', 'worldnews', 'environment', 'climate', 'weather', 'NaturalDisaster']:
            try:
                subreddit = reddit.subreddit(subreddit_name)
                for post in subreddit.new(limit=100):
                    post_time = datetime.fromtimestamp(post.created_utc, tz=timezone.utc)
                    if post_time < cutoff_time:
                        continue

                    # Check if post contains any of the keywords
                    combined_text = f"{post.title.lower()} {post.selftext.lower()}"
                    if any(keyword.lower() in combined_text for keyword in keywords):
                        posts.append({
                            'subreddit': subreddit_name,
                            'title': post.title,
                            'text': post.selftext,
                            'url': post.url,
                            'created_utc': post_time.strftime('%Y-%m-%d %H:%M:%S UTC'),
                            'score': post.score,
                            'num_comments': post.num_comments
                        })

            except Exception as e:
                logger.error(f"Error fetching from r/{subreddit_name}: {str(e)}")
                continue

        if not posts:
            return jsonify({
                'success': False,
                'error': 'No posts found matching the criteria'
            }), 404

        # Convert posts to DataFrame for visualization
        posts_df = pd.DataFrame(posts)

        # Generate visualizations
        try:
            # Combine all text for word cloud
            all_text = ' '.join([f"{post['title']} {post['text']}" for post in posts])
            
            # Generate visualizations
            generate_word_cloud(all_text, 'word_cloud.png')
            generate_time_series(posts_df, 'time_series.png')
            generate_sentiment_analysis(posts_df, 'sentiment_analysis.png')
            generate_subreddit_distribution(posts_df, 'subreddit_distribution.png')

            # Convert images to base64
            visualizations = {
                'word_cloud': image_to_base64('word_cloud.png'),
                'time_series': image_to_base64('time_series.png'),
                'sentiment_analysis': image_to_base64('sentiment_analysis.png'),
                'subreddit_distribution': image_to_base64('subreddit_distribution.png')
            }

        except Exception as e:
            logger.error(f"Error generating visualizations: {str(e)}")
            visualizations = {}

        return jsonify({
            'success': True,
            'posts': posts,
            'visualizations': visualizations,
            'metadata': {
                'total_posts': len(posts),
                'time_range': f'Last {hours_back} hours',
                'keywords_used': keywords
            }
        })

    except Exception as e:
        logger.error(f"Error in fetch_and_analyze: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 