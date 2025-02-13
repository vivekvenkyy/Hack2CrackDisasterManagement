import { useState } from 'react';
import './DisasterPrediction.css';

function DisasterPrediction() {
  const [location, setLocation] = useState('');
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      setPredictionData(data);
      setActiveTab('overview');
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="disaster-prediction">
      <div className="prediction-hero">
        <h1>Disaster Prediction Analysis</h1>
        <p>Historical Data Analysis and Future Predictions</p>
      </div>

      <div className="prediction-container">
        {/* Input Form */}
        <div className="prediction-form-card">
          <h2>Enter Analysis Location</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="location">Country/Region:</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter country name"
                required
              />
            </div>

            <button type="submit" className="predict-button" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Analyzing Data...
                </>
              ) : (
                <>
                  <i className="fas fa-analytics"></i> Analyze Disasters
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {predictionData && (
          <div className="prediction-results">
            <h2>Analysis Results for {predictionData.location}</h2>

            {/* Navigation Tabs */}
            <div className="results-tabs">
              <button
                className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="fas fa-chart-pie"></i> Overview
              </button>
              <button
                className={`tab-button ${activeTab === 'predictions' ? 'active' : ''}`}
                onClick={() => setActiveTab('predictions')}
              >
                <i className="fas fa-chart-line"></i> Predictions
              </button>
              <button
                className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
                onClick={() => setActiveTab('analysis')}
              >
                <i className="fas fa-microscope"></i> Detailed Analysis
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="tab-content">
                <div className="result-section summary">
                  <h3><i className="fas fa-info-circle"></i> Data Summary</h3>
                  <div className="summary-grid">
                    <div className="summary-card">
                      <i className="fas fa-database"></i>
                      <h4>Total Records</h4>
                      <p>{predictionData.summary.total_records}</p>
                    </div>
                    <div className="summary-card">
                      <i className="fas fa-calendar-alt"></i>
                      <h4>Data Range</h4>
                      <p>{predictionData.summary.data_year_range}</p>
                    </div>
                    <div className="summary-card">
                      <i className="fas fa-exclamation-triangle"></i>
                      <h4>Most Common Disaster</h4>
                      <p>{predictionData.summary.most_common_disaster}</p>
                    </div>
                  </div>
                </div>

                <div className="result-section visualizations">
                  <h3><i className="fas fa-chart-bar"></i> Disaster Distribution</h3>
                  <img
                    src={`data:image/png;base64,${predictionData.plots.disaster_types}`}
                    alt="Disaster Type Distribution"
                    className="prediction-plot"
                  />
                </div>
              </div>
            )}

            {/* Predictions Tab */}
            {activeTab === 'predictions' && (
              <div className="tab-content">
                <div className="result-section trends">
                  <h3><i className="fas fa-chart-line"></i> Probability Trends</h3>
                  <img
                    src={`data:image/png;base64,${predictionData.plots.trends}`}
                    alt="Probability Trends"
                    className="prediction-plot"
                  />
                </div>

                <div className="result-section predictions">
                  <h3><i className="fas fa-list-alt"></i> Detailed Predictions</h3>
                  {predictionData.predictions.length > 0 ? (
                    Object.entries(
                      predictionData.predictions.reduce((acc, pred) => {
                        if (!acc[pred.year]) acc[pred.year] = [];
                        acc[pred.year].push(pred);
                        return acc;
                      }, {})
                    ).map(([year, yearPredictions]) => (
                      <div key={year} className="year-predictions">
                        <h4><i className="far fa-calendar"></i> {year}</h4>
                        <div className="predictions-grid">
                          {yearPredictions.map((pred, index) => (
                            <div
                              key={index}
                              className={`prediction-card ${pred.risk_level.toLowerCase()}`}
                            >
                              <h5>{pred.disaster_type}</h5>
                              <p className="probability">{pred.probability.toFixed(1)}% Probability</p>
                              <span className="risk-badge">{pred.risk_level} Risk</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-predictions">No significant predictions found.</p>
                  )}
                </div>
              </div>
            )}

            {/* Analysis Tab */}
            {activeTab === 'analysis' && (
              <div className="tab-content">
                <div className="result-section terminal-output">
                  <h3><i className="fas fa-terminal"></i> Analysis Log</h3>
                  <pre>{predictionData.terminal_output}</pre>
                </div>

                <div className="result-section probabilities">
                  <h3><i className="fas fa-percentage"></i> Annual Probabilities</h3>
                  <div className="probabilities-grid">
                    {Object.entries(predictionData.probabilities.by_type).map(([type, prob]) => (
                      <div key={type} className="probability-card">
                        <h4>{type}</h4>
                        <p className="probability">{prob.toFixed(1)}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DisasterPrediction;