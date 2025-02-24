import pandas as pd
import numpy as np
from datetime import datetime
import os

def load_and_prepare_data():
    try:
        # Get the absolute path to the data file
        current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        data_path = os.path.join(current_dir, 'data', 'disaster_data.csv')
        
        print(f"Attempting to read file from: {data_path}")  # Debug print
        
        if not os.path.exists(data_path):
            raise FileNotFoundError(f"Data file not found at {data_path}")
        
        # Read CSV data
        df = pd.read_csv(data_path)
        
        # Convert Year columns to datetime
        df['Start Year'] = pd.to_datetime(df['Start Year'], format='%Y')
        
        return df
    
    except Exception as e:
        print(f"Error loading data: {str(e)}")
        raise

def calculate_disaster_probability(historical_data, future_years=10):
    predictions = {}
    probabilities = {}
    current_year = datetime.now().year
    
    for country in historical_data['Country'].unique():
        country_data = historical_data[historical_data['Country'] == country]
        
        # Calculate frequency of each disaster type
        disaster_counts = country_data['Disaster Type'].value_counts()
        total_years = current_year - 1900
        
        # Calculate probability for each disaster type
        for disaster_type in disaster_counts.index:
            yearly_probability = disaster_counts[disaster_type] / total_years
            
            # Adjust probability based on recent trends (last 20 years)
            recent_data = country_data[
                country_data['Start Year'].dt.year >= (current_year - 20)
            ]
            recent_count = len(recent_data[recent_data['Disaster Type'] == disaster_type])
            recent_probability = recent_count / 20
            
            # Weighted average of historical and recent probabilities
            adjusted_probability = (0.3 * yearly_probability + 0.7 * recent_probability)
            
            # Store probabilities
            if country not in probabilities:
                probabilities[country] = {}
            probabilities[country][disaster_type] = adjusted_probability
    
    return probabilities

def predict_future_disasters(probabilities, threshold=0.3):
    current_year = datetime.now().year
    future_years = range(current_year + 1, current_year + 11)
    predictions = []
    
    for country in probabilities:
        for disaster_type, probability in probabilities[country].items():
            for year in future_years:
                # Add random variation to probability (±10%)
                varied_prob = probability * np.random.uniform(0.9, 1.1)
                # Normalize probability
                varied_prob = min(max(varied_prob, 0), 1)
                
                if varied_prob > threshold:
                    risk_level = 'High' if varied_prob > 0.6 else 'Medium'
                    predictions.append({
                        'Country': country,
                        'Year': year,
                        'Disaster_Type': disaster_type,
                        'Probability': varied_prob,
                        'Risk_Level': risk_level
                    })
    
    return pd.DataFrame(predictions)

def generate_graphs(predictions_df, country):
    country_data = predictions_df[predictions_df['Country'] == country]
    
    graphs = []
    
    # Line plot for probability trends
    graphs.append({
        'data': [
            {
                'x': country_data['Year'].tolist(),
                'y': (country_data['Probability'] * 100).tolist(),
                'type': 'scatter',
                'mode': 'lines+markers',
                'name': country
            }
        ],
        'layout': {
            'title': 'Disaster Probability Trends',
            'xaxis': {'title': 'Year'},
            'yaxis': {'title': 'Probability (%)'}
        }
    })
    
    # Bar plot for disaster types
    disaster_probs = country_data.groupby('Disaster_Type')['Probability'].mean() * 100
    graphs.append({
        'data': [
            {
                'x': disaster_probs.index.tolist(),
                'y': disaster_probs.values.tolist(),
                'type': 'bar',
                'name': 'Average Probability'
            }
        ],
        'layout': {
            'title': 'Average Probability by Disaster Type',
            'xaxis': {'title': 'Disaster Type'},
            'yaxis': {'title': 'Average Probability (%)'}
        }
    })
    
    return graphs
