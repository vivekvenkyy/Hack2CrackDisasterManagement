import './Home.css';
import disasterImage from '../assets/dis-img.jpg';  // Add this import
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function Home() {
  const navigate = useNavigate();

  const handleEmergencyClick = () => {
    // Navigate to emergency contacts page
    navigate('/emergency-contacts');
  };

  const handleEducationalClick = () => {
    navigate('/educational-awareness');
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
          <div 
            className="service-card"
            onClick={() => navigate('/community-support')}
          >
            <div className="p-6">
              <i className="fas fa-hands-helping text-4xl text-white mb-4"></i>
              <h3 className="text-xl font-bold text-white mb-2">Community Support & Volunteering</h3>
              <p className="text-blue-100">
                Connect with NGOs and volunteer organizations for disaster relief efforts.
              </p>
            </div>
          </div>
          <div 
            className="service-card transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer bg-gradient-to-br from-blue-800 to-blue-600"
            onClick={handleEducationalClick}
          >
            <div className="p-6">
              <i className="fas fa-book text-4xl text-white mb-4"></i>
              <h3 className="text-xl font-bold text-white mb-2">Educational Awareness & Training</h3>
              <p className="text-blue-100">
                Access comprehensive guides and training materials for disaster preparedness and response.
              </p>
              <div className="mt-4 text-white flex items-center">
                <span>Learn More</span>
                <span className="ml-2">→</span>
              </div>
            </div>
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

      {/* Emergency Resources Section */}
      <section className="resources-section">
        <Container>
          <h2 className="section-heading">
            <i className="fas fa-first-aid section-icon"></i>
            Emergency Resources
          </h2>
          <Row>
            <Col md={4}>
              <Card className="resource-card">
                <Card.Body>
                  <Card.Title>Emergency Contacts</Card.Title>
                  <Card.Text>
                    Quick access to emergency numbers, helplines, and local authorities for immediate assistance during disasters.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="resource-card">
                <Card.Body>
                  <Card.Title>First Aid Guide</Card.Title>
                  <Card.Text>
                    Essential first aid information and procedures for common emergency situations.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="resource-card">
                <Card.Body>
                  <Card.Title>Evacuation Plans</Card.Title>
                  <Card.Text>
                    Detailed evacuation routes and safety protocols for different types of disasters.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Community Support Section */}
      <section className="community-section">
        <Container>
          <h2 className="section-heading">
            <i className="fas fa-hands-helping section-icon"></i>
            Community Support & Volunteering
          </h2>
          <Row>
            <Col md={4}>
              <Card className="community-card">
                <Card.Body>
                  <Card.Title>Volunteer Programs</Card.Title>
                  <Card.Text>
                    Join our volunteer network to help communities prepare for and recover from disasters.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="community-card">
                <Card.Body>
                  <Card.Title>Donation Centers</Card.Title>
                  <Card.Text>
                    Find information about donation centers and ways to contribute to disaster relief efforts.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="community-card">
                <Card.Body>
                  <Card.Title>Support Groups</Card.Title>
                  <Card.Text>
                    Connect with support groups and community organizations focused on disaster preparedness.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Educational Awareness Section */}
      <section className="education-section">
        <Container>
          <h2 className="section-heading">
            <i className="fas fa-graduation-cap section-icon"></i>
            Educational Awareness & Training
          </h2>
          <Row>
            <Col md={4}>
              <Card className="education-card">
                <Card.Body>
                  <Card.Title>Training Programs</Card.Title>
                  <Card.Text>
                    Access disaster management training programs and certification courses.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="education-card">
                <Card.Body>
                  <Card.Title>Educational Resources</Card.Title>
                  <Card.Text>
                    Browse through our collection of educational materials and disaster preparedness guides.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="education-card">
                <Card.Body>
                  <Card.Title>Awareness Campaigns</Card.Title>
                  <Card.Text>
                    Learn about ongoing awareness campaigns and participate in community education initiatives.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
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