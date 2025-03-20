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
import pickle
import numpy as np
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Enable CORS for all domains (for development)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Get the base directory (where app.py is located)
BASE_DIR = Path(__file__).resolve().parent

# Define paths relative to the base directory
MODEL_PATH = BASE_DIR / 'models' / 'disaster_prediction_models.pkl'  # Note: changed to correct filename
CSV_PATH = BASE_DIR / 'data' / 'comprehensive_disaster_predictions_2025_2034.csv'

# Create directories if they don't exist
(BASE_DIR / 'models').mkdir(exist_ok=True)
(BASE_DIR / 'data').mkdir(exist_ok=True)

print(f"Looking for model at: {MODEL_PATH}")
print(f"Looking for CSV at: {CSV_PATH}")

# Month number to name mapping
MONTHS = {
    1: 'January', 2: 'February', 3: 'March', 4: 'April',
    5: 'May', 6: 'June', 7: 'July', 8: 'August',
    9: 'September', 10: 'October', 11: 'November', 12: 'December'
}

# Load model
try:
    model_data = joblib.load(MODEL_PATH)
    print("Model loaded successfully")
    print("Model data structure:", type(model_data))
    print("Model contents:", model_data.keys() if isinstance(model_data, dict) else "Not a dictionary")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    model_data = None

# Define the flood features
FLOOD_FEATURES = [
    'MonsoonIntensity', 'TopographyDrainage', 'RiverManagement',
    'Deforestation', 'Urbanization', 'ClimateChange', 'DamsQuality',
    'Siltation', 'AgriculturalPractices', 'Encroachments',
    'IneffectiveDisasterPreparedness', 'DrainageSystems',
    'CoastalVulnerability', 'Landslides', 'Watersheds',
    'DeterioratingInfrastructure', 'PopulationScore', 'WetlandLoss',
    'InadequatePlanning', 'PoliticalFactors'
]

# Global variables for models
flood_model = None
drought_model = None

def load_models():
    global flood_model, drought_model
    try:
        # Load flood model
        flood_model_path = os.path.join(os.path.dirname(__file__), 'models\\xgboost_flood_model.pkl')
        flood_model = joblib.load(flood_model_path)
        logger.info("Flood model loaded successfully")

        # Load drought model
        drought_model_path = os.path.join(os.path.dirname(__file__), 'models\\random_forest_model.pkl')
        drought_model = joblib.load(drought_model_path)
        logger.info("Drought model loaded successfully")

        # Add this after loading the drought model
        if hasattr(drought_model, 'feature_names_in_'):
            print("Expected features for drought model:", drought_model.feature_names_in_)
        else:
            # For older scikit-learn versions
            print("Model features cannot be automatically detected")

        # You can also check the number of features the model expects
        n_features = drought_model.n_features_in_ if hasattr(drought_model, 'n_features_in_') else None
        print("Number of features expected:", n_features)

    except Exception as e:
        logger.error(f"Error loading models: {str(e)}")
        raise

# Load models when the app starts
load_models()

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

@app.route('/api/predict-flood', methods=['POST'])
def predict_flood():
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data received'}), 400

        # Verify all required features are present
        missing_features = [feat for feat in FLOOD_FEATURES if feat not in data]
        if missing_features:
            return jsonify({
                'error': f'Missing required features: {", ".join(missing_features)}'
            }), 400

        # Create input DataFrame with proper feature order
        input_data = pd.DataFrame({
            feature: [float(data[feature])] for feature in FLOOD_FEATURES
        })

        # Convert DataFrame to numpy array
        input_array = input_data.values
        
        # Make prediction directly using the model
        prediction = flood_model.predict(input_array)[0]
        
        return jsonify({
            'success': True,
            'prediction': float(prediction),
            'probability': float(prediction)
        })

    except Exception as e:
        logger.error(f"Error in predict_flood: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/predict-drought', methods=['POST'])
def predict_drought():
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data received'}), 400

        # All 15 features from train_timeseries.csv (excluding the 6 mentioned)
        required_features = [
            'fips',
            'PS',
            'QV2M',
            'T2M',
            'T2MDEW',
            'T2M_MAX',
            'T2M_MIN',
            'T2M_RANGE',
            'TS',
            'WS10M',
            'WS10M_RANGE',
            'WS50M',
            'WS50M_MAX',
            'WS50M_RANGE',
            'date'
        ]
        
        # Check if all required features are present
        missing_features = [feat for feat in required_features if feat not in data]
        if missing_features:
            return jsonify({
                'error': f'Missing required features: {", ".join(missing_features)}'
            }), 400

        # Create input array for prediction
        input_dict = {}
        for feature in required_features:
            if feature == 'date':
                # Convert date to a numerical value (days since epoch)
                date_obj = pd.to_datetime(data[feature])
                input_dict[feature] = date_obj.timestamp() / (24 * 60 * 60)  # Convert to days
            else:
                input_dict[feature] = float(data[feature])

        input_data = pd.DataFrame([input_dict])

        # Make prediction
        prediction = drought_model.predict(input_data)[0]
        
        return jsonify({
            'success': True,
            'prediction': float(prediction)
        })

    except Exception as e:
        logger.error(f"Error in predict_drought: {str(e)}")
        traceback.print_exc()  # This will help debug the error
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/features', methods=['GET'])
def get_features():
    """Endpoint to get the list of required features for both models"""
    return jsonify({
        'flood_features': FLOOD_FEATURES,
        'drought_features': ['prectot', 't2mwet', 'ws10m_max', 'ws10m_min', 'ws50m_min', 'month']
    })

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

def convert_probability(prob_str):
    """Convert probability string (e.g., '43.10%') to float"""
    try:
        return float(prob_str.rstrip('%'))
    except (ValueError, AttributeError):
        print(f"Error converting probability: {prob_str}")
        return 0.0

@app.route('/api/predict-indian-disaster', methods=['POST'])
def predict_disaster():
    try:
        # Get input data
        data = request.json
        print("Received input:", data)

        # Read the CSV file
        df = pd.read_csv(CSV_PATH)
        
        # Create a month mapping dictionary
        month_mapping = {
            'January': 1, 'February': 2, 'March': 3, 'April': 4,
            'May': 5, 'June': 6, 'July': 7, 'August': 8,
            'September': 9, 'October': 10, 'November': 11, 'December': 12
        }
        
        # Convert month names to numbers in the DataFrame
        df['Month'] = df['Month'].map(lambda x: month_mapping.get(x.strip(), 0))
        
        # Get input parameters
        month = int(data['month'])
        year = int(data['year'])
        state = data['state']

        print(f"Looking for - State: {state}, Month: {month}, Year: {year}")

        # Filter the data based on input parameters
        filtered_data = df[
            (df['State'].str.strip() == state) & 
            (df['Month'] == month) &  # Now comparing numeric months
            (df['Year'] == year)
        ]

        print(f"Found {len(filtered_data)} matching records")

        if filtered_data.empty:
            return jsonify({
                'success': False,
                'error': f'No predictions available for {state} in Month {month} {year}',
                'debug_info': {
                    'input_month': month,
                    'input_state': state,
                    'input_year': year
                }
            }), 404

        # Prepare predictions from the filtered data
        predictions = []
        for _, row in filtered_data.iterrows():
            prob_value = convert_probability(row['Probability'])
            print(f"Converting probability: {row['Probability']} -> {prob_value}")
            
            predictions.append({
                'type': row['Disaster Type'],
                'probability': prob_value,
                'climate_zone': row['Climate Zone'],
                'season': row['Season']
            })

        # Sort by probability
        predictions.sort(key=lambda x: x['probability'], reverse=True)

        # Convert month number back to name for response
        months_reverse = {v: k for k, v in month_mapping.items()}
        month_name = months_reverse.get(month, str(month))

        return jsonify({
            'success': True,
            'state': state,
            'month': month_name,  # Send back month name for display
            'year': year,
            'predictions': predictions
        })

    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e),
            'debug_info': {
                'error_type': type(e).__name__,
                'error_details': str(e)
            }
        }), 500

# Add this at the top of your file with other constants
months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # Get input data
        data = request.json
        print("Received input:", data)  # Debug print

        # Read CSV data
        df = pd.read_csv(CSV_PATH)
        
        # Create input for model
        input_data = pd.DataFrame({
            'State': [data['state']],
            'Month': [data['month']],
            'Year': [int(data['year'])]
        })

        # Get model prediction
        prediction_proba = model_data.predict_proba(input_data)[0]
        disaster_types = model_data.classes_

        # Get additional info from CSV
        csv_info = df[
            (df['State'] == data['state']) & 
            (df['Month'] == data['month']) & 
            (df['Year'] == int(data['year']))
        ]

        # Prepare predictions
        predictions = []
        for i, disaster_type in enumerate(disaster_types):
            if prediction_proba[i] > 0.1:  # Only include if probability > 10%
                # Get climate and season info from CSV if available
                disaster_info = csv_info[csv_info['Disaster Type'] == disaster_type]
                climate_zone = disaster_info['Climate Zone'].iloc[0] if not disaster_info.empty else 'Unknown'
                season = disaster_info['Season'].iloc[0] if not disaster_info.empty else 'Unknown'
                
                predictions.append({
                    'type': disaster_type,
                    'probability': round(float(prediction_proba[i] * 100), 2),
                    'climate_zone': climate_zone,
                    'season': season
                })

        # Sort by probability
        predictions.sort(key=lambda x: x['probability'], reverse=True)

        return jsonify({
            'success': True,
            'predictions': predictions
        })

    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 
