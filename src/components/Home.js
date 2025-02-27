import './Home.css';
import disasterImage from '../assets/dis-img.jpg';  // Add this import
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleEmergencyClick = () => {
    // Navigate to emergency contacts page
    navigate('/emergency-contacts');
  };

  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to Apada Mitra</h1>
        <h2>Your Trusted Disaster Management Companion</h2>
        <p className="hero-text">
          Disasters can strike at any moment, and preparedness is the key to minimizing damage and ensuring safety. 
          <strong> Apada Mitra</strong> is a dedicated platform committed to providing timely information, resources, 
          and assistance to individuals, communities, and organizations in times of crisis.
        </p>
      </div>

      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          Our goal is to empower communities with the knowledge, tools, and support they need to effectively 
          respond to and recover from disasters. We aim to bridge the gap between emergency responders, 
          government agencies, and the public, ensuring seamless coordination and prompt action.
        </p>
      </section>

      <section className="services-section">
        <h2>What We Offer</h2>
        <div className="services-grid">
          <div className="service-card">
            <i className="fas fa-bell"></i>
            <h3>Real-Time Alerts & Warnings</h3>
            <p>Stay informed with up-to-date notifications on natural disasters, extreme weather conditions, and emergency situations.</p>
          </div>
          <div 
            className="service-card transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer bg-gradient-to-br from-blue-800 to-blue-600"
            onClick={handleEmergencyClick} 
          >
            <div className="p-6">
              <i className="fas fa-book-medical text-4xl text-white mb-4"></i>
              <h3 className="text-xl font-bold text-white mb-2">Emergency Resources</h3>
              <p className="text-blue-100">
                Access essential emergency contacts, safety guides, and preparedness plans for different types of disasters.
              </p>
              <div className="mt-4 text-white flex items-center">
                <span>View Directory</span>
                <span className="ml-2">→</span>
              </div>
            </div>
          </div>
          <div className="service-card">
            <i className="fas fa-users"></i>
            <h3>Community Support & Volunteering</h3>
            <p>Connect with disaster relief organizations and volunteer to help those in need.</p>
          </div>
          <div className="service-card">
            <i className="fas fa-chalkboard-teacher"></i>
            <h3>Educational Awareness & Training</h3>
            <p>Learn about disaster preparedness through workshops, webinars, and informative articles.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Be Prepared, Stay Safe</h2>
        <p>
          At <strong>Apada Mitra</strong>, we believe that preparedness saves lives. By equipping yourself 
          with the right knowledge and resources, you can protect yourself, your loved ones, and your 
          community from unforeseen calamities.
        </p>
        <div className="cta-content">
          <h3>Join us in building a resilient and prepared society.</h3>
          <p>Stay alert, stay safe, and let's stand together in times of need.</p>
          <button className="cta-button">Contact Us</button>
        </div>
      </section>

      <footer className="home-footer">
        <p>For more information, contact us at <strong>[your contact details]</strong></p>
        <div className="social-links">
          <a href="#" className="social-link"><i className="fab fa-facebook"></i></a>
          <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
          <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
        </div>
      </footer>
    </div>
  );
}

export default Home;