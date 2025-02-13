import './MentalHealth.css';

function MentalHealth() {
  return (
    <div className="mental-health">
      <div className="mental-health-hero">
        <h1>Mental Health Support</h1>
        <h2>You're Not Alone</h2>
        <p className="hero-description">
          Disasters can be overwhelming, not just physically but emotionally and mentally as well. 
          <strong> Apada Mitra</strong> is here to provide a safe space and valuable resources to help 
          you cope with stress, anxiety, and trauma in times of crisis.
        </p>
      </div>

      <section className="why-matters">
        <h2>Why Mental Health Matters</h2>
        <p>
          During and after disasters, individuals may experience fear, uncertainty, grief, and distress. 
          Addressing mental health is just as crucial as physical safety, ensuring long-term recovery and well-being.
        </p>
      </section>

      <section className="support-services">
        <h2>How We Can Help</h2>
        <div className="services-container">
          <div className="service-card">
            <i className="fas fa-phone-alt"></i>
            <h3>24/7 Helpline Support</h3>
            <p>Access confidential mental health helplines to talk to professionals anytime you need assistance.</p>
            <button className="contact-btn">Call Now</button>
          </div>

          <div className="service-card">
            <i className="fas fa-heart"></i>
            <h3>Self-Care & Coping Strategies</h3>
            <p>Learn practical techniques to manage stress, build resilience, and maintain emotional well-being.</p>
            <button className="contact-btn">Learn More</button>
          </div>

          <div className="service-card">
            <i className="fas fa-users"></i>
            <h3>Community Support & Counseling</h3>
            <p>Connect with support groups, mental health professionals, and online forums to share your experiences.</p>
            <button className="contact-btn">Join Community</button>
          </div>

          <div className="service-card">
            <i className="fas fa-chalkboard-teacher"></i>
            <h3>Workshops & Awareness Programs</h3>
            <p>Participate in sessions that provide insights on trauma recovery, mindfulness, and emotional strength.</p>
            <button className="contact-btn">Register Now</button>
          </div>

          <div className="service-card">
            <i className="fas fa-first-aid"></i>
            <h3>Emergency Mental Health First Aid</h3>
            <p>Get quick tips on how to help yourself and others during moments of emotional distress.</p>
            <button className="contact-btn">Get Help</button>
          </div>
        </div>
      </section>

      <section className="support-message">
        <h2>You Are Not Alone</h2>
        <p>
          It's okay to seek help. Mental well-being is a journey, and <strong>Apada Mitra</strong> is 
          here to support you every step of the way.
        </p>
        <div className="emergency-contact">
          <p>
            If you or someone you know is struggling, reach out to our mental health support team or contact 
            <strong> [your helpline/contact details]</strong> for immediate assistance.
          </p>
          <button className="emergency-btn">Get Immediate Help</button>
        </div>
      </section>

      <div className="closing-message">
        <h3>Together, we can heal and rebuild stronger.</h3>
      </div>
    </div>
  );
}

export default MentalHealth;