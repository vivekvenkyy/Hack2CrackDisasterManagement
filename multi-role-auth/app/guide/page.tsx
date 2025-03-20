'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaChevronDown, FaChevronUp, FaDownload, FaShareAlt, FaArrowUp, FaComment } from 'react-icons/fa';
import { GiEarthCrack, GiFlood, GiTornado, GiEarthSpit, GiHeatHaze, GiSnowing, GiLightningStorm, GiDroplets } from 'react-icons/gi';

export default function Guide() {
  const [activeDisaster, setActiveDisaster] = useState('earthquakes');
  const [showModal, setShowModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);

  const disasters = [
    { name: 'earthquakes', icon: <GiEarthCrack className="w-5 h-5" />, largeIcon: <GiEarthCrack className="w-16 h-16 text-green-600" /> },
    { name: 'floods', icon: <GiFlood className="w-5 h-5" />, largeIcon: <GiFlood className="w-16 h-16 text-green-600" /> },
    { name: 'cyclones', icon: <GiTornado className="w-5 h-5" />, largeIcon: <GiTornado className="w-16 h-16 text-green-600" /> },
    { name: 'landslides', icon: <GiEarthSpit className="w-5 h-5" />, largeIcon: <GiEarthSpit className="w-16 h-16 text-green-600" /> },
    { name: 'heatwaves', icon: <GiHeatHaze className="w-5 h-5" />, largeIcon: <GiHeatHaze className="w-16 h-16 text-green-600" /> },
    { name: 'coldwaves', icon: <GiSnowing className="w-5 h-5" />, largeIcon: <GiSnowing className="w-16 h-16 text-green-600" /> },
    { name: 'thunderstorms', icon: <GiLightningStorm className="w-5 h-5" />, largeIcon: <GiLightningStorm className="w-16 h-16 text-green-600" /> },
    { name: 'droughts', icon: <GiDroplets className="w-5 h-5" />, largeIcon: <GiDroplets className="w-16 h-16 text-green-600" /> },
  ];

  // Smooth scroll to content when disaster changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeDisaster]);

  // Show/hide scroll-to-top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDownloadAllGuides = () => {
    alert('Downloading all disaster preparedness guides...');
  };

  const handleShareGuide = () => {
    const shareData = {
      title: `Disaster Preparedness Guide: ${activeDisaster.charAt(0).toUpperCase() + activeDisaster.slice(1)}`,
      text: `Check out this comprehensive guide on how to prepare for and respond to ${activeDisaster}!`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.error('Share failed:', err));
    } else {
      alert('Sharing is not supported on this device. Copy the URL to share: ' + shareData.url);
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFeedback = () => {
    alert('Feedback form coming soon! Please share your suggestions via email: support@disasterapp.com');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-gray-200 opacity-50">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-800 to-green-600 text-white rounded-xl shadow-2xl p-8 mb-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10"></div>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white hover:text-yellow-400 font-medium transition-colors mb-6"
          >
            <FaArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <h1 className="text-4xl sm:text-5xl font-bold animate-fade-in">
            Comprehensive Disaster Preparedness & Response Guide
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-gray-200">
            Empower Yourself: Be Ready for Any Disaster
          </p>
          <p className="mt-2 text-sm text-gray-300">Last Updated: March 20, 2025</p>
        </div>

        {/* Disaster Navigation */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md rounded-lg shadow-md p-4 mb-8 sm:mb-10">
          <div className="flex overflow-x-auto sm:grid sm:grid-cols-4 gap-3 justify-center scrollbar-hide">
            {disasters.map((disaster) => (
              <button
                key={disaster.name}
                onClick={() => setActiveDisaster(disaster.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  activeDisaster === disaster.name
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {disaster.icon}
                {disaster.name.charAt(0).toUpperCase() + disaster.name.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Disaster Content */}
        <div ref={contentRef} className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 transition-opacity duration-500">
          {activeDisaster === 'earthquakes' && (
            <DisasterSection
              title="Earthquakes"
              icon={disasters.find((d) => d.name === 'earthquakes')?.largeIcon}
              preparedness={[
                'Secure Your Home: Anchor heavy furniture, use cabinet latches.',
                'Emergency Kit: Water (3 days), food, flashlight, batteries, first aid, documents.',
                'Family Plan: Establish meeting points, emergency contacts.',
                'Building Safety: Follow earthquake-resistant codes.',
              ]}
              safetyTips={[
                'Indoors: Drop, Cover, Hold On under a sturdy table.',
                'Outdoors: Move to open space, away from buildings.',
                'In a Vehicle: Pull over safely, avoid overpasses.',
              ]}
              postActions={[
                'Check for injuries, provide first aid.',
                'Inspect home for gas leaks, structural damage.',
                'Stay informed about aftershocks.',
              ]}
              media="Infographics on 'Drop, Cover, Hold', videos on earthquake preparedness."
              documentLink="https://ndmindia.mha.gov.in"
              documentText="NDMA Guidelines on Earthquake Management"
              onShowQuickTips={() => setShowModal(true)}
            />
          )}

          {activeDisaster === 'floods' && (
            <DisasterSection
              title="Floods"
              icon={disasters.find((d) => d.name === 'floods')?.largeIcon}
              preparedness={[
                'Know Risk: Identify flood-prone zones, learn evacuation routes.',
                'Protect Valuables: Keep documents in waterproof bags.',
                'Home Prep: Elevate electrical appliances, install check valves.',
              ]}
              safetyTips={[
                'Evacuate early if warnings are issued.',
                'Avoid floodwaters: Just 6 inches can knock you down.',
                'Stay updated with weather reports.',
              ]}
              postActions={[
                'Return home only when authorities declare it safe.',
                'Check for structural damage and avoid downed power lines.',
                'Use clean, boiled water to prevent infections.',
              ]}
              media="Flood zone maps, instructional flood safety videos."
              documentLink="https://ndmindia.mha.gov.in"
              documentText="NDMA Guidelines on Flood Management"
              onShowQuickTips={() => setShowModal(true)}
            />
          )}

          {activeDisaster === 'cyclones' && (
            <DisasterSection
              title="Cyclones"
              icon={disasters.find((d) => d.name === 'cyclones')?.largeIcon}
              preparedness={[
                'Secure Property: Reinforce roofs, secure outdoor items.',
                'Emergency Supplies: Food, water, flashlights, power banks.',
                'Understand Warnings: Pay attention to Cyclone Alerts.',
              ]}
              safetyTips={[
                'Stay indoors, away from windows.',
                'Have emergency contacts handy.',
                'Listen to official updates.',
              ]}
              postActions={[
                'Inspect homes for gas leaks and power line damage.',
                'Use bottled water for drinking.',
                'Seek medical help if needed.',
              ]}
              media="Cyclone safety diagrams, warning signal audio clips."
              documentLink="https://ndmindia.mha.gov.in"
              documentText="NDMA Guidelines on Cyclone Management"
              onShowQuickTips={() => setShowModal(true)}
            />
          )}

          {activeDisaster === 'landslides' && (
            <DisasterSection
              title="Landslides"
              icon={disasters.find((d) => d.name === 'landslides')?.largeIcon}
              preparedness={[
                'Recognize Warning Signs: Cracks in ground, leaning trees.',
                'Avoid Construction on steep slopes.',
                'Monitor Local Weather Reports.',
              ]}
              safetyTips={['Move to safer ground if a landslide is imminent.', 'Stay alert during heavy rains.']}
              postActions={['Avoid the slide area for secondary slides.', 'Report damaged roads and utilities.']}
              media="Before-and-after images of landslides."
              documentLink="https://ndmindia.mha.gov.in"
              documentText="NDMA Guidelines on Landslide Management"
              onShowQuickTips={() => setShowModal(true)}
            />
          )}

          {activeDisaster === 'heatwaves' && (
            <DisasterSection
              title="Heatwaves"
              icon={disasters.find((d) => d.name === 'heatwaves')?.largeIcon}
              preparedness={['Stay Hydrated: Drink plenty of water.', 'Wear light, loose clothing.', 'Limit outdoor activities.']}
              safetyTips={['Recognize heatstroke signs: Dizziness, rapid heartbeat.', 'Use cooling shelters if available.']}
              postActions={['Cool down gradually to avoid shock.', 'Check on elderly and vulnerable individuals.']}
              media="Temperature forecast charts, heatstroke first-aid videos."
              documentLink="https://ndmindia.mha.gov.in"
              documentText="NDMA Guidelines on Heatwave Management"
              onShowQuickTips={() => setShowModal(true)}
            />
          )}

          {activeDisaster === 'coldwaves' && (
            <DisasterSection
              title="Cold Waves"
              icon={disasters.find((d) => d.name === 'coldwaves')?.largeIcon}
              preparedness={['Insulate homes, seal doors and windows.', 'Wear multiple layers of warm clothing.']}
              safetyTips={['Use safe heating methods to prevent CO poisoning.', 'Check on elderly and vulnerable people.']}
              postActions={['Handle frostbite carefully.', 'Restore water supply after frozen pipes.']}
              media="Cold wave alerts, heating safety infographics."
              documentLink="https://ndmindia.mha.gov.in"
              documentText="NDMA Guidelines on Cold Wave Management"
              onShowQuickTips={() => setShowModal(true)}
            />
          )}

          {activeDisaster === 'thunderstorms' && (
            <DisasterSection
              title="Thunderstorms & Lightning"
              icon={disasters.find((d) => d.name === 'thunderstorms')?.largeIcon}
              preparedness={['Unplug electrical appliances to prevent surges.', 'Stay indoors during storms.']}
              safetyTips={['Avoid open fields and tall trees.', 'Do not use wired electronics.']}
              postActions={['Check for electrical damage.', 'Stay updated for further weather alerts.']}
              media="Lightning safety posters, storm preparedness videos."
              documentLink="https://ndmindia.mha.gov.in"
              documentText="NDMA Guidelines on Thunderstorms & Lightning"
              onShowQuickTips={() => setShowModal(true)}
            />
          )}

          {activeDisaster === 'droughts' && (
            <DisasterSection
              title="Droughts"
              icon={disasters.find((d) => d.name === 'droughts')?.largeIcon}
              preparedness={['Practice water conservation and rainwater harvesting.', 'Grow drought-resistant crops.']}
              safetyTips={['Ration water usage for essentials.', 'Support community water initiatives.']}
              postActions={['Restore soil and replenish water sources.']}
              media="Daily water-saving tips, drought case studies."
              documentLink="https://ndmindia.mha.gov.in"
              documentText="NDMA Guidelines on Drought Management"
              onShowQuickTips={() => setShowModal(true)}
            />
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownloadAllGuides}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:bg-green-500 hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <FaDownload className="w-5 h-5" />
              Download All Guides
            </button>
            <button
              onClick={handleShareGuide}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:bg-blue-500 hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FaShareAlt className="w-5 h-5" />
              Share Guide
            </button>
            <button
              onClick={handleFeedback}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:bg-gray-500 hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <FaComment className="w-5 h-5" />
              Provide Feedback
            </button>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 p-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Quick Tips Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Quick Safety Tips for {activeDisaster.charAt(0).toUpperCase() + activeDisaster.slice(1)}
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {disasters
                .find((d) => d.name === activeDisaster)
                ?.safetyTips?.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface DisasterSectionProps {
  title: string;
  icon?: React.ReactNode;
  preparedness: string[];
  safetyTips: string[];
  postActions: string[];
  media: string;
  documentLink: string;
  documentText: string;
  onShowQuickTips: () => void;
}

function DisasterSection({
  title,
  icon,
  preparedness,
  safetyTips,
  postActions,
  media,
  documentLink,
  documentText,
  onShowQuickTips,
}: DisasterSectionProps) {
  const [isPreparednessOpen, setIsPreparednessOpen] = useState(true);
  const [isSafetyTipsOpen, setIsSafetyTipsOpen] = useState(true);
  const [isPostActionsOpen, setIsPostActionsOpen] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {icon}
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      </div>

      {/* Quick Tips Button */}
      <button
        onClick={onShowQuickTips}
        className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium hover:bg-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Quick Safety Tips
      </button>

      {/* Preparedness Guide */}
      <div className="border border-gray-200 rounded-lg shadow-sm">
        <button
          onClick={() => setIsPreparednessOpen(!isPreparednessOpen)}
          className="w-full flex justify-between items-center px-4 py-3 text-xl font-semibold text-green-800 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-expanded={isPreparednessOpen}
          aria-controls="preparedness-section"
        >
          Preparedness Guide
          {isPreparednessOpen ? (
            <FaChevronUp className="w-5 h-5 text-green-600" />
          ) : (
            <FaChevronDown className="w-5 h-5 text-green-600" />
          )}
        </button>
        {isPreparednessOpen && (
          <div id="preparedness-section" className="px-4 py-3">
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {preparedness.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Safety Tips */}
      <div className="border border-gray-200 rounded-lg shadow-sm">
        <button
          onClick={() => setIsSafetyTipsOpen(!isSafetyTipsOpen)}
          className="w-full flex justify-between items-center px-4 py-3 text-xl font-semibold text-green-800 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-expanded={isSafetyTipsOpen}
          aria-controls="safety-tips-section"
        >
          Safety Tips
          {isSafetyTipsOpen ? (
            <FaChevronUp className="w-5 h-5 text-green-600" />
          ) : (
            <FaChevronDown className="w-5 h-5 text-green-600" />
          )}
        </button>
        {isSafetyTipsOpen && (
          <div id="safety-tips-section" className="px-4 py-3">
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {safetyTips.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Post-Disaster Actions */}
      <div className="border border-gray-200 rounded-lg shadow-sm">
        <button
          onClick={() => setIsPostActionsOpen(!isPostActionsOpen)}
          className="w-full flex justify-between items-center px-4 py-3 text-xl font-semibold text-green-800 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-expanded={isPostActionsOpen}
          aria-controls="post-actions-section"
        >
          Post-Disaster Actions
          {isPostActionsOpen ? (
            <FaChevronUp className="w-5 h-5 text-green-600" />
          ) : (
            <FaChevronDown className="w-5 h-5 text-green-600" />
          )}
        </button>
        {isPostActionsOpen && (
          <div id="post-actions-section" className="px-4 py-3">
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {postActions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Media and Documents */}
      <div className="space-y-2">
        <p className="text-gray-700">
          <span className="text-green-600 font-medium">📌 Relevant Media:</span> {media}
        </p>
        <p className="text-gray-700">
          <span className="text-green-600 font-medium">📄 Documents:</span>{' '}
          <a
            href={documentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {documentText}
          </a>
        </p>
      </div>
    </div>
  );
}