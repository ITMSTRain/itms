import React from "react";

const AboutSection: React.FC = () => {
  return (
    <section className="py-16 px-4 max-w-4xl mx-auto text-center">
      {/* Our Story */}
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
        Our Story
      </h2>
      <p className="text-lg text-gray-600 leading-relaxed hover:text-gray-800 transition-colors duration-300 mb-8">
        RoadGuard (Real-time Optical Analysis and Detection for Governance Using
        AI to Reinforce Driving) was developed in response to growing traffic
        challenges. Leveraging AI and real-time data processing, it aims to
        improve traffic safety, congestion, and law enforcement through smarter,
        data-driven solutions.
      </p>

      {/* Our Mission */}
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
        Our Mission
      </h2>
      <p className="text-lg text-gray-600 leading-relaxed hover:text-gray-800 transition-colors duration-300">
        RoadGuard is committed to enhancing road safety and traffic management
        by:
      </p>
      <ul className="flex flex-wrap justify-center gap-8 text-gray-600 my-4 text-left">
        <li className="before:content-['•'] before:mr-2">
          Collecting and analyzing traffic data from CCTV and road accident
          records.
        </li>
        <li className="before:content-['•'] before:mr-2">
          Monitoring vehicle speed, traffic flow, vehicle types, and pedestrian
          movement.
        </li>
        <li className="before:content-['•'] before:mr-2">
          Delivering real-time insights through a dashboard, logs, and visual
          analytics.
        </li>
      </ul>
      <p className="text-lg text-gray-600 leading-relaxed hover:text-gray-800 transition-colors duration-300">
        Our goal is to create smarter, safer roads for everyone.
      </p>
    </section>
  );
};

export default AboutSection;
