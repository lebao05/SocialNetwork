// Components/Profile/AboutTab.jsx
import { useState } from "react";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Heart,
  Calendar,
} from "lucide-react";

export default function AboutTab() {
  const [activeSection, setActiveSection] = useState("Overview");

  const sections = [
    "Overview",
    "Work and Education",
    "Live in",
    "Contact and Basic Info",
    "Family and Relationships",
  ];

  const aboutInfo = {
    overview: "Software Developer passionate about coding and traveling.",
    work: [{ profession: "Software Developer", company: "TechCorp" }],
    education: [
      { school: "Stanford University", degree: "BSc Computer Science" },
    ],
    places: {
      current: "Ho Chi Minh City",
      hometown: "New York, NY",
    },
    contact: {
      phone: "+84 123 456 789",
      email: "john.doe@example.com",
    },
    relationship: "Single",
    birthday: "January 15, 1995",
  };

  return (
    <div className="bg-white rounded-lg shadow flex">
      {/* Left Sidebar */}
      <div className="w-1/3 border-r border-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">About</h2>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section}>
              <button
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-3 py-2 rounded-md ${
                  activeSection === section
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {section}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Content */}
      <div className="w-2/3 p-6">
        {activeSection === "Overview" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Overview</h3>
            <p className="text-gray-700">{aboutInfo.overview}</p>
          </div>
        )}

        {activeSection === "Work and Education" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Work and Education</h3>
            {aboutInfo.work.map((job, i) => (
              <div key={i} className="flex items-center mb-2 text-gray-700">
                <Briefcase className="h-5 w-5 mr-2 text-gray-500" />
                Works as {job.profession} at {job.company}
              </div>
            ))}
            {aboutInfo.education.map((edu, i) => (
              <div key={i} className="flex items-center mb-2 text-gray-700">
                <GraduationCap className="h-5 w-5 mr-2 text-gray-500" />
                Studied {edu.degree} at {edu.school}
              </div>
            ))}
          </div>
        )}

        {activeSection === "Live in" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Live in</h3>
            <div className="flex items-center mb-2 text-gray-700">
              <MapPin className="h-5 w-5 mr-2 text-gray-500" />
              Lives in {aboutInfo.places.current}
            </div>
            <div className="flex items-center mb-2 text-gray-700">
              <MapPin className="h-5 w-5 mr-2 text-gray-500" />
              From {aboutInfo.places.hometown}
            </div>
          </div>
        )}

        {activeSection === "Contact and Basic Info" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Contact and Basic Info
            </h3>
            <div className="flex items-center mb-2 text-gray-700">
              <Phone className="h-5 w-5 mr-2 text-gray-500" />
              {aboutInfo.contact.phone}
            </div>
            <div className="flex items-center mb-2 text-gray-700">
              <Mail className="h-5 w-5 mr-2 text-gray-500" />
              {aboutInfo.contact.email}
            </div>
            <div className="flex items-center mb-2 text-gray-700">
              <Calendar className="h-5 w-5 mr-2 text-gray-500" />
              Birthday: {aboutInfo.birthday}
            </div>
          </div>
        )}

        {activeSection === "Family and Relationships" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Family and Relationships
            </h3>
            <div className="flex items-center mb-2 text-gray-700">
              <Heart className="h-5 w-5 mr-2 text-gray-500" />
              Relationship: {aboutInfo.relationship}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
