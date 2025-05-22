import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation, Shield, Cloud, MapPin, Clock, Ban } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Smart Route
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Weather-aware navigation for safer, smarter journeys
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Start for Free
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            icon={Cloud}
            title="Weather-Optimized Routes"
            description="Real-time weather data integration for safer journey planning"
          />
          <FeatureCard
            icon={Clock}
            title="Real-Time Updates"
            description="Live traffic and weather condition updates during your journey"
          />
          <FeatureCard
            icon={Shield}
            title="Safety First"
            description="Alternative routes suggested during severe weather conditions"
          />
          <FeatureCard
            icon={MapPin}
            title="Points of Interest"
            description="Find nearby hotels, hospitals, restaurants, and more"
          />
          <FeatureCard
            icon={Navigation}
            title="Smart Navigation"
            description="Turn-by-turn directions with weather alerts"
          />
          <FeatureCard
            icon={Ban}
            title="Avoid Obstacles"
            description="Skip toll roads and heavy traffic areas"
          />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Enter Your Route"
              description="Input your starting point and destination"
            />
            <StepCard
              number="2"
              title="Get Smart Routes"
              description="Receive weather-optimized route options"
            />
            <StepCard
              number="3"
              title="Travel Safely"
              description="Enjoy real-time updates and alerts"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
}> = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors duration-200">
      <Icon className="w-12 h-12 text-blue-500 mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

const StepCard: React.FC<{
  number: string;
  title: string;
  description: string;
}> = ({ number, title, description }) => {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};