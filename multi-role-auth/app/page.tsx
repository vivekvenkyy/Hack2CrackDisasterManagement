export default function Home() {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-800 to-green-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10"></div>
        <div className="container mx-auto flex flex-col md:flex-row items-center px-6 relative z-10">
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight animate-fade-in">
              Disaster Management App
            </h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              Your all-in-one solution for disaster preparedness, response, and recovery. Stay informed, connected, and safe.
            </p>
            <a
              href="/register"
              className="inline-block bg-yellow-500 text-black px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-yellow-400 hover:scale-105 transform transition-all duration-300"
            >
              Get Started
            </a>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
              alt="Disaster Management Illustration"
              className="w-full rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 animate-fade-in">
            Comprehensive Disaster Support
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="text-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <img
                src="https://images.unsplash.com/photo-1506784365847-bbadad4e1f72?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                alt="Mental Health AI"
                className="w-48 h-48 mx-auto rounded-lg mb-6 object-cover"
              />
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Mental Health AI</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Support for post-disaster victims with AI-driven mental health tools.
              </p>
              <a
                href="/mental-health"
                className="text-green-600 font-medium hover:text-green-500 transition-colors"
              >
                Learn More →
              </a>
            </div>
            {/* Feature 2 */}
            <div className="text-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                alt="Emergency Contacts"
                className="w-48 h-48 mx-auto rounded-lg mb-6 object-cover"
              />
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Emergency Contacts</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Access trustworthy emergency contacts instantly.
              </p>
              <a
                href="/emergency-contacts"
                className="text-green-600 font-medium hover:text-green-500 transition-colors"
              >
                Learn More →
              </a>
            </div>
            {/* Feature 3 */}
            <div className="text-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                alt="Community Support"
                className="w-48 h-48 mx-auto rounded-lg mb-6 object-cover"
              />
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Community Support</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Join a community for interaction and mutual help.
              </p>
              <a
                href="/community"
                className="text-green-600 font-medium hover:text-green-500 transition-colors"
              >
                Learn More →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2 grid grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Real-Time Updates</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Stay informed with real-time disaster tweets and predictions.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Educational Resources</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Access emergency guides and educational videos.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Global Predictions</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                International and national disaster predictions.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Flood & Drought Alerts</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get timely flood and drought predictions.
              </p>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Disaster Preparedness"
              className="w-full rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Stay Safe"
              className="w-full rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 text-center md:text-left space-y-6">
            <h2 className="text-4xl font-bold text-gray-900 animate-fade-in">
              Be Prepared, Stay Safe
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our app equips you with the tools and knowledge to handle disasters effectively. Join us today and take control of your safety.
            </p>
            <a
              href="/register"
              className="inline-block bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-green-500 hover:scale-105 transform transition-all duration-300"
            >
              Join Now
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-12">
        <div className="container mx-auto px-6 text-center space-y-6">
          <div className="flex justify-center gap-4">
            <a href="/about" className="text-gray-300 hover:text-yellow-500 transition-colors">
              About
            </a>
            <a href="/contact" className="text-gray-300 hover:text-yellow-500 transition-colors">
              Contact
            </a>
            <a href="/privacy" className="text-gray-300 hover:text-yellow-500 transition-colors">
              Privacy Policy
            </a>
          </div>
          <p className="text-gray-400">© 2025 Disaster Management App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}