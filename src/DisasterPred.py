from datetime import datetime
import plotly.express as px
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import plotly.graph_objects as go
from plotly.subplots import make_subplots



def load_and_prepare_data():
    # Read CSV data
    df = pd.read_csv('1900_2021_DISASTERS.xlsx - emdat data.csv')
    
    # Convert Year columns to datetime
    df['Start Year'] = pd.to_datetime(df['Start Year'], format='%Y')
    
    return df

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

def normalize_probability(prob):
    """Normalize probability to be between 0 and 100"""
    return min(max(prob * 100, 0), 100)

def visualize_future_predictions(predictions_df):
    # Create a copy of the dataframe with normalized probabilities
    plot_df = predictions_df.copy()
    plot_df['Probability'] = plot_df['Probability'].apply(normalize_probability)
    
    # 1. Line plot for probability trends over years
    fig1 = go.Figure()
    
    for country in plot_df['Country'].unique():
        country_data = plot_df[plot_df['Country'] == country]
        mean_probs = country_data.groupby('Year')['Probability'].mean()
        
        fig1.add_trace(go.Scatter(
            x=mean_probs.index,
            y=mean_probs.values,
            name=country,
            mode='lines+markers',
            hovertemplate="Year: %{x}<br>" +
                         "Probability: %{y:.1f}%<br>" +
                         "Country: " + country
        ))
    
    fig1.update_layout(
        title='Disaster Probability Trends by Country (2025-2035)',
        xaxis_title='Year',
        yaxis_title='Probability (%)',
        hovermode='x unified',
        yaxis=dict(range=[0, 100]),
        showlegend=True,
        legend=dict(
            yanchor="top",
            y=0.99,
            xanchor="left",
            x=1.05
        ),
        margin=dict(r=150)
    )
    fig1.show()

    # 2. Bar plot for disaster types with error bars
    disaster_stats = plot_df.groupby('Disaster_Type').agg({
        'Probability': ['mean', 'std']
    }).reset_index()
    
    disaster_stats.columns = ['Disaster_Type', 'Mean_Probability', 'Std_Probability']
    
    fig2 = go.Figure()
    
    fig2.add_trace(go.Bar(
        x=disaster_stats['Disaster_Type'],
        y=disaster_stats['Mean_Probability'],
        error_y=dict(
            type='data',
            array=disaster_stats['Std_Probability'],
            visible=True
        ),
        hovertemplate="Disaster Type: %{x}<br>" +
                     "Probability: %{y:.1f}%<br>" +
                     "<extra></extra>"
    ))
    
    fig2.update_layout(
        title='Average Probability by Disaster Type',
        xaxis_title='Disaster Type',
        yaxis_title='Average Probability (%)',
        yaxis=dict(range=[0, 100]),
        showlegend=False,
        margin=dict(b=100)
    )
    
    fig2.update_xaxes(tickangle=45)
    fig2.show()

    # 3. Bubble chart for risk levels
    fig3 = px.scatter(
        plot_df,
        x='Year',
        y='Probability',
        size='Probability',
        color='Risk_Level',
        hover_data=['Country', 'Disaster_Type'],
        title='Disaster Risk Levels Over Time',
        labels={'Probability': 'Probability (%)',
                'Risk_Level': 'Risk Level'}
    )
    
    fig3.update_layout(
        yaxis=dict(range=[0, 100]),
        hovermode='closest'
    )
    fig3.show()

def print_detailed_predictions(predictions_df):
    # Sort by probability in descending order
    sorted_predictions = predictions_df.copy()
    sorted_predictions['Probability'] = sorted_predictions['Probability'].apply(normalize_probability)
    sorted_predictions = sorted_predictions.sort_values(['Year', 'Probability'], ascending=[True, False])
    
    # Group by year and print top predictions
    for year in sorted_predictions['Year'].unique():
        year_predictions = sorted_predictions[sorted_predictions['Year'] == year]
        print(f"\nPredictions for {year}:")
        print("-" * 80)
        
        for _, row in year_predictions.iterrows():
            if row['Probability'] >= 30:  # Only show probabilities >= 30%
                print(f"Country: {row['Country']}")
                print(f"Disaster Type: {row['Disaster_Type']}")
                print(f"Probability: {row['Probability']:.1f}%")
                print(f"Risk Level: {row['Risk_Level']}")
                print("-" * 40)

# The risk level calculation in the predict_future_disasters function should also be updated:
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

def visualize_future_predictions(predictions_df):
    # Create multiple visualizations
    plt.figure(figsize=(15, 8))
    
    # 1. Line plot for probability trends over years
    for country in predictions_df['Country'].unique():
        country_data = predictions_df[predictions_df['Country'] == country]
        mean_probs = country_data.groupby('Year')['Probability'].mean() * 100  # Convert to percentage
        plt.plot(mean_probs.index, mean_probs.values, marker='o', label=country, linewidth=2)
    
    plt.title('Disaster Probability Trends by Country (2025-2035)', fontsize=12, pad=20)
    plt.xlabel('Year', fontsize=10)
    plt.ylabel('Probability (%)', fontsize=10)
    plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.show()

    # 2. Bar plot for disaster types
    plt.figure(figsize=(15, 8))
    disaster_probs = predictions_df.groupby('Disaster_Type')['Probability'].mean() * 100  # Convert to percentage
    colors = plt.cm.Paired(np.linspace(0, 1, len(disaster_probs)))
    
    bars = plt.bar(disaster_probs.index, disaster_probs.values, color=colors)
    plt.title('Average Probability by Disaster Type', fontsize=12, pad=20)
    plt.xlabel('Disaster Type', fontsize=10)
    plt.ylabel('Average Probability (%)', fontsize=10)
    plt.xticks(rotation=45, ha='right')
    
    # Add percentage labels on top of bars
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:.1f}%', ha='center', va='bottom')
    
    plt.grid(True, alpha=0.3, axis='y')
    plt.tight_layout()
    plt.show()

def print_detailed_predictions(predictions_df):
    # Sort by probability in descending order
    sorted_predictions = predictions_df.sort_values(['Year', 'Probability'], ascending=[True, False])
    
    # Group by year and print top predictions
    for year in sorted_predictions['Year'].unique():
        year_predictions = sorted_predictions[sorted_predictions['Year'] == year]
        print(f"\nPredictions for {year}:")
        print("-" * 80)
        
        for _, row in year_predictions.iterrows():
            if row['Probability'] >= 0.3:  # Only show significant probabilities
                print(f"Country: {row['Country']}")
                print(f"Disaster Type: {row['Disaster_Type']}")
                print(f"Probability: {row['Probability']*100:.1f}%")  # Convert to percentage
                print(f"Risk Level: {row['Risk_Level']}")
                print("-" * 40)

def main():
    # Load and prepare data
    print("Loading and preparing data...")
    df = load_and_prepare_data()
    
    # Calculate probabilities
    print("Calculating disaster probabilities...")
    probabilities = calculate_disaster_probability(df)
    
    # Generate predictions
    print("Generating future predictions...")
    predictions_df = predict_future_disasters(probabilities)
    
    # Visualize predictions
    print("\nGenerating visualization...")
    visualize_future_predictions(predictions_df)
    
    # Print detailed predictions
    print("\nDetailed Predictions:")
    print_detailed_predictions(predictions_df)

if __name__ == "__main__":
    main()