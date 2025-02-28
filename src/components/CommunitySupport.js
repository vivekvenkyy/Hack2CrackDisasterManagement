import { useNavigate } from 'react-router-dom';
import './CommunitySupport.css';

export default function CommunitySupport() {
  const navigate = useNavigate();

  return (
    <div className="community-container">
      <div className="content-wrapper">
        <button 
          onClick={() => navigate('/')}
          className="back-button"
        >
          <span className="back-icon">←</span>
          <span className="back-text">Back to Home</span>
        </button>

        <h1 className="main-title">Emergency Contacts & NGOs in India</h1>
        <p className="subtitle">
          Disaster relief efforts require coordinated action. Below is a list of trusted NGOs, government agencies, and emergency contacts in India that volunteers can reach out to for rescue operations, aid distribution, and crisis management.
        </p>

        <section className="emergency-section">
          <h2>📞 Emergency Helpline Numbers</h2>
          <p className="section-intro">For immediate assistance, contact the following helplines:</p>

          <div className="helpline-category">
            <h3>🚨 National Disaster & Rescue Helplines</h3>
            <div className="contact-card">
              <h4>National Disaster Management Authority (NDMA)</h4>
              <p>📞 011-26701728 / 1078</p>
              <a href="https://ndma.gov.in/" target="_blank" rel="noopener noreferrer">Website</a>
            </div>
            <div className="contact-card">
              <h4>National Disaster Response Force (NDRF)</h4>
              <p>📞 +91-9711077372 / 011-24363260</p>
              <a href="https://ndrf.gov.in/" target="_blank" rel="noopener noreferrer">Website</a>
            </div>
            <div className="contact-card">
              <h4>Indian Meteorological Department (IMD) - Cyclone & Weather Alerts</h4>
              <p>📞 1800-180-1717</p>
              <a href="https://mausam.imd.gov.in/" target="_blank" rel="noopener noreferrer">Website</a>
            </div>
          </div>

          <div className="helpline-category">
            <h3>🏥 Medical & Health Emergency Services</h3>
            <div className="contact-card">
              <h4>108 Emergency Ambulance Service</h4>
              <p>Available in multiple states</p>
            </div>
            <div className="contact-card">
              <h4>Indian Red Cross Society</h4>
              <p>📞 011-23359379 / 23357085</p>
              <a href="https://www.indianredcross.org/" target="_blank" rel="noopener noreferrer">Website</a>
            </div>
            <div className="contact-card">
              <h4>Doctors For You (DFY) - Medical Relief NGO</h4>
              <p>📞 022-26688355</p>
              <a href="https://www.doctorsforyou.org/" target="_blank" rel="noopener noreferrer">Website</a>
            </div>
          </div>

          <div className="helpline-category">
            <h3>🚧 Road & Transportation Rescue</h3>
            <div className="contact-card">
              <h4>National Highway Helpline</h4>
              <p>📞 1033</p>
            </div>
            <div className="contact-card">
              <h4>Indian Railways Emergency Helpline</h4>
              <p>📞 139</p>
            </div>
          </div>

          <div className="helpline-category">
            <h3>💧 Flood & Drought Helplines</h3>
            <div className="contact-card">
              <h4>Central Water Commission (CWC) Flood Control Room</h4>
              <p>📞 011-26187232</p>
              <a href="http://www.cwc.gov.in/" target="_blank" rel="noopener noreferrer">Website</a>
            </div>
            <div className="contact-card">
              <h4>Agriculture Ministry Drought Helpline</h4>
              <p>📞 1800-180-1551</p>
            </div>
          </div>
        </section>

        <section className="ngo-section">
          <h2>🌍 Trusted NGOs & Relief Organizations in India</h2>
          <p className="section-intro">Volunteers can connect with these organizations for rescue missions, donations, and relief efforts.</p>

          <div className="ngo-category">
            <h3>🛠 Disaster Response & Relief NGOs</h3>
            <div className="ngo-card">
              <h4>Goonj (Disaster Relief & Humanitarian Aid)</h4>
              <p>📞 011-41401216</p>
              <a href="https://goonj.org/" target="_blank" rel="noopener noreferrer">Website</a>
            </div>
            <div className="ngo-card">
              <h4>SEEDS India (Sustainable Environment & Emergency Response)</h4>
              <p>📞 011-26174272</p>
              <a href="https://www.seedsindia.org/" target="_blank" rel="noopener noreferrer">Website</a>
            </div>
            <div className="ngo-card">
              <h4>Rapid Response (Disaster Relief NGO)</h4>
              <p>📞 +91-9886007767</p>
              <a href="https://www.rapidresponse.org.in/" target="_blank" rel="noopener noreferrer">Website</a>
            </div>
          </div>

          <div className="ngo-category">
            <h3>🍽 Food & Shelter Aid NGOs</h3>
            <div className="ngo-card">
              <h4>Akshaya Patra Foundation (Food for Disaster Victims)</h4>
              <p>📞 +91-80-30143400</p>
              <a href="https://www.akshayapatra.org/" target="_blank" rel="noopener noreferrer">Website</a>
            </div>
            <div className="ngo-card">
              <h4>Uday Foundation (Relief Camps & Shelter Support)</h4>
              <p>📞 +91-11-26561333</p>
              <a href="https://www.udayfoundation.org/" target="_blank" rel="noopener noreferrer">Website</a>
            </div>
            <div className="ngo-card">
              <h4>Feeding India by Zomato (Hunger & Crisis Support)</h4>
              <p>📞 Contact via App</p>
              <a href="https://www.feedingindia.org/" target="_blank" rel="noopener noreferrer">Website</a>
            </div>
          </div>

          <div className="ngo-category">
            <h3>💰 Donation & Fundraising NGOs</h3>
            <div className="ngo-card">
              <h4>GiveIndia (Disaster Relief & Crowdfunding)</h4>
              <p>📞 +91-7738714428</p>
              <a href="https://www.giveindia.org/" target="_blank" rel="noopener noreferrer">Website</a>
            </div>
            <div className="ngo-card">
              <h4>Ketto (Fundraising for Disaster Survivors)</h4>
              <a href="https://www.ketto.org/" target="_blank" rel="noopener noreferrer">Website</a>
            </div>
          </div>
        </section>

        <section className="get-involved">
          <h2>📧 How to Get Involved?</h2>
          <ul>
            <li>🔹 Contact the nearest NGO from the list above and sign up for volunteer work.</li>
            <li>🔹 Call the emergency numbers if you need immediate assistance or want to report a disaster situation.</li>
            <li>🔹 Sign up on our platform to receive disaster alerts and volunteer opportunities.</li>
          </ul>
          <p className="help-note">💡 Need more help? Email us at <a href="mailto:support@volunteerindia.org">support@volunteerindia.org</a></p>
        </section>
      </div>
    </div>
  );
}