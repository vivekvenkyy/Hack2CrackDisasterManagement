from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.prediction import (
    load_and_prepare_data,
    calculate_disaster_probability,
    predict_future_disasters,
    generate_graphs
)
import traceback

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

if __name__ == '__main__':
    app.run(debug=True, port=5000) 