import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EducationalAwareness.css';

export default function EducationalAwareness() {
  const [activeDisaster, setActiveDisaster] = useState('earthquakes');
  const navigate = useNavigate();

  return (
    <div className="educational-container">
      <div className="content-wrapper">
        <button 
          onClick={() => navigate('/')}
          className="back-button"
        >
          <span className="back-icon">←</span>
          <span className="back-text">Back to Home</span>
        </button>

        <h1 className="main-title">Comprehensive Disaster Preparedness & Response Guide</h1>

        <div className="disaster-nav">
          {['earthquakes', 'floods', 'cyclones', 'landslides', 'heatwaves', 'coldwaves', 'thunderstorms', 'droughts'].map((disaster) => (
            <button 
              key={disaster}
              className={`nav-button ${activeDisaster === disaster ? 'active' : ''}`}
              onClick={() => setActiveDisaster(disaster)}
            >
              {disaster.charAt(0).toUpperCase() + disaster.slice(1)}
            </button>
          ))}
        </div>

        <div className="disaster-content">
          {activeDisaster === 'earthquakes' && (
            <DisasterSection 
              title="Earthquakes"
              preparedness={[
                "Secure Your Home: Anchor heavy furniture, use cabinet latches.",
                "Emergency Kit: Water (3 days), food, flashlight, batteries, first aid, documents.",
                "Family Plan: Establish meeting points, emergency contacts.",
                "Building Safety: Follow earthquake-resistant codes."
              ]}
              safetyTips={[
                "Indoors: Drop, Cover, Hold On under a sturdy table.",
                "Outdoors: Move to open space, away from buildings.",
                "In a Vehicle: Pull over safely, avoid overpasses."
              ]}
              postActions={[
                "Check for injuries, provide first aid.",
                "Inspect home for gas leaks, structural damage.",
                "Stay informed about aftershocks."
              ]}
              media="Infographics on 'Drop, Cover, Hold', videos on earthquake preparedness."
              documentLink="https://ndmindia.mha.gov.in"
              documentText="NDMA Guidelines on Earthquake Management"
            />
          )}

          {activeDisaster === 'floods' && (
            <DisasterSection 
              title="Floods"
              preparedness={[
                "Know Risk: Identify flood-prone zones, learn evacuation routes.",
                "Protect Valuables: Keep documents in waterproof bags.",
                "Home Prep: Elevate electrical appliances, install check valves."
              ]}
              safetyTips={[
                "Evacuate early if warnings are issued.",
                "Avoid floodwaters: Just 6 inches can knock you down.",
                "Stay updated with weather reports."
              ]}
              postActions={[
                "Return home only when authorities declare it safe.",
                "Check for structural damage and avoid downed power lines.",
                "Use clean, boiled water to prevent infections."
              ]}
              media="Flood zone maps, instructional flood safety videos."
              documentLink="https://ndmindia.mha.gov.in"
              documentText="NDMA Guidelines on Flood Management"
            />
          )}

          {activeDisaster === 'cyclones' && (
            <DisasterSection 
              title="Cyclones"
              preparedness={[
                "Secure Property: Reinforce roofs, secure outdoor items.",
                "Emergency Supplies: Food, water, flashlights, power banks.",
                "Understand Warnings: Pay attention to Cyclone Alerts."
              ]}
              safetyTips={[
                "Stay indoors, away from windows.",
                "Have emergency contacts handy.",
                "Listen to official updates."
              ]}
              postActions={[
                "Inspect homes for gas leaks and power line damage.",
                "Use bottled water for drinking.",
                "Seek medical help if needed."
              ]}
              media="Cyclone safety diagrams, warning signal audio clips."
              documentLink="https://ndmindia.mha.gov.in"
              documentText="NDMA Guidelines on Cyclone Management"
            />
          )}

          {activeDisaster === 'landslides' && (
            <DisasterSection 
              title="Landslides"
              preparedness={[
                "Recognize Warning Signs: Cracks in ground, leaning trees.",
                "Avoid Construction on steep slopes.",
                "Monitor Local Weather Reports."
              ]}
              safetyTips={[
                "Move to safer ground if a landslide is imminent.",
                "Stay alert during heavy rains."
              ]}
              postActions={[
                "Avoid the slide area for secondary slides.",
                "Report damaged roads and utilities."
              ]}
              media="Before-and-after images of landslides."
              documentLink="https://ndmindia.mha.gov.in"
              documentText="NDMA Guidelines on Landslide Management"
            />
          )}

          {activeDisaster === 'heatwaves' && (
            <DisasterSection 
              title="Heatwaves"
              preparedness={[
                "Stay Hydrated: Drink plenty of water.",
                "Wear light, loose clothing.",
                "Limit outdoor activities."
              ]}
              safetyTips={[
                "Recognize heatstroke signs: Dizziness, rapid heartbeat.",
                "Use cooling shelters if available."
              ]}
              postActions={[
                "Cool down gradually to avoid shock.",
                "Check on elderly and vulnerable individuals."
              ]}
              media="Temperature forecast charts, heatstroke first-aid videos."
              documentLink="https://ndmindia.mha.gov.in"
              documentText="NDMA Guidelines on Heatwave Management"
            />
          )}

          {activeDisaster === 'coldwaves' && (
            <DisasterSection 
              title="Cold Waves"
              preparedness={[
                "Insulate homes, seal doors and windows.",
                "Wear multiple layers of warm clothing."
              ]}
              safetyTips={[
                "Use safe heating methods to prevent CO poisoning.",
                "Check on elderly and vulnerable people."
              ]}
              postActions={[
                "Handle frostbite carefully.",
                "Restore water supply after frozen pipes."
              ]}
              media="Cold wave alerts, heating safety infographics."
              documentLink="https://ndmindia.mha.gov.in"
              documentText="NDMA Guidelines on Cold Wave Management"
            />
          )}

          {activeDisaster === 'thunderstorms' && (
            <DisasterSection 
              title="Thunderstorms & Lightning"
              preparedness={[
                "Unplug electrical appliances to prevent surges.",
                "Stay indoors during storms."
              ]}
              safetyTips={[
                "Avoid open fields and tall trees.",
                "Do not use wired electronics."
              ]}
              postActions={[
                "Check for electrical damage.",
                "Stay updated for further weather alerts."
              ]}
              media="Lightning safety posters, storm preparedness videos."
              documentLink="https://ndmindia.mha.gov.in"
              documentText="NDMA Guidelines on Thunderstorms & Lightning"
            />
          )}

          {activeDisaster === 'droughts' && (
            <DisasterSection 
              title="Droughts"
              preparedness={[
                "Practice water conservation and rainwater harvesting.",
                "Grow drought-resistant crops."
              ]}
              safetyTips={[
                "Ration water usage for essentials.",
                "Support community water initiatives."
              ]}
              postActions={[
                "Restore soil and replenish water sources."
              ]}
              media="Daily water-saving tips, drought case studies."
              documentLink="https://ndmindia.mha.gov.in"
              documentText="NDMA Guidelines on Drought Management"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function DisasterSection({ title, preparedness, safetyTips, postActions, media, documentLink, documentText }) {
  return (
    <div className="disaster-section">
      <h2>{title}</h2>
      <h3>Preparedness Guide</h3>
      <ul>{preparedness.map((item, index) => <li key={index}>{item}</li>)}</ul>
      <h3>Safety Tips</h3>
      <ul>{safetyTips.map((item, index) => <li key={index}>{item}</li>)}</ul>
      <h3>Post-Disaster Actions</h3>
      <ul>{postActions.map((item, index) => <li key={index}>{item}</li>)}</ul>
      <p>📌 <strong>Relevant Media:</strong> {media}</p>
      <p>📄 <strong>Documents:</strong> <a href={documentLink} target="_blank" rel="noopener noreferrer">{documentText}</a></p>
    </div>
  );
}