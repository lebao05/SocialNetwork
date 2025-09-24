import { use, useState } from "react";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Heart,
  Calendar,
  Plus,
  MoreHorizontal,
  Edit3,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { format, parseISO } from "date-fns";
export default function AboutTab() {
  const [activeSection, setActiveSection] = useState("Places lived");
  const profile = useSelector((state) => state.currentUser.profile);
  const myAuth = useSelector((state) => state.auth.user);
  const isMe = myAuth?.id === profile?.id;
  // State for work
  const [work, setWork] = useState([
    {
      id: 1,
      profession: "Software Developer",
      company: "TechCorp",
      isWorking: true,
    },
  ]);

  // State for education
  const [education, setEducation] = useState([
    {
      id: 1,
      school: "Stanford University",
      degree: "BSc Computer Science",
      isStudying: false,
    },
  ]);

  // State for places
  const [currentCity, setCurrentCity] = useState("Ho Chi Minh City");
  const [hometown, setHometown] = useState("New York, NY");

  // State for relationship
  const [relationship, setRelationship] = useState("Single");

  // Edit states
  const [editingWork, setEditingWork] = useState(null);
  const [editingEducation, setEditingEducation] = useState(null);
  const [editingCurrentCity, setEditingCurrentCity] = useState(false);
  const [editingHometown, setEditingHometown] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState(false);

  // Dropdown states
  const [showWorkDropdown, setShowWorkDropdown] = useState(null);
  const [showEducationDropdown, setShowEducationDropdown] = useState(null);
  const [showCurrentCityDropdown, setShowCurrentCityDropdown] = useState(false);
  const [showHometownDropdown, setShowHometownDropdown] = useState(false);
  const [showRelationshipDropdown, setShowRelationshipDropdown] =
    useState(false);

  // Temp values for editing
  const [tempValues, setTempValues] = useState({});

  const sections = [
    "Overview",
    "Work and Education",
    "Places lived",
    "Contact and Basic Info",
    "Family and Relationships",
  ];

  const relationshipOptions = [
    "Single",
    "In a relationship",
    "Engaged",
    "Married",
    "It's complicated",
    "Divorced",
  ];

  // Work functions
  const addWork = () => {
    const newWork = {
      id: Date.now(),
      profession: "",
      company: "",
      isWorking: true,
    };
    setWork([...work, newWork]);
    setEditingWork(newWork.id);
    setTempValues({
      profession: "",
      company: "",
      isWorking: true,
    });
  };

  const editWork = (workItem) => {
    setEditingWork(workItem.id);
    setTempValues({
      profession: workItem.profession,
      company: workItem.company,
      isWorking: workItem.isWorking,
    });
    setShowWorkDropdown(null);
  };

  const saveWork = () => {
    setWork(
      work.map((w) => (w.id === editingWork ? { ...w, ...tempValues } : w))
    );
    setEditingWork(null);
    setTempValues({});
  };

  const cancelEditWork = () => {
    // If it's a new item with empty values, remove it
    const workItem = work.find((w) => w.id === editingWork);
    if (workItem && !workItem.profession && !workItem.company) {
      setWork(work.filter((w) => w.id !== editingWork));
    }
    setEditingWork(null);
    setTempValues({});
  };

  const deleteWork = (id) => {
    setWork(work.filter((w) => w.id !== id));
    setShowWorkDropdown(null);
  };

  // Education functions
  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      school: "",
      degree: "",
      isStudying: false,
    };
    setEducation([...education, newEducation]);
    setEditingEducation(newEducation.id);
    setTempValues({
      school: "",
      degree: "",
      isStudying: false,
    });
  };

  const editEducation = (eduItem) => {
    setEditingEducation(eduItem.id);
    setTempValues({
      school: eduItem.school,
      degree: eduItem.degree,
      isStudying: eduItem.isStudying,
    });
    setShowEducationDropdown(null);
  };

  const saveEducation = () => {
    setEducation(
      education.map((e) =>
        e.id === editingEducation ? { ...e, ...tempValues } : e
      )
    );
    setEditingEducation(null);
    setTempValues({});
  };

  const cancelEditEducation = () => {
    // If it's a new item with empty values, remove it
    const eduItem = education.find((e) => e.id === editingEducation);
    if (eduItem && !eduItem.school && !eduItem.degree) {
      setEducation(education.filter((e) => e.id !== editingEducation));
    }
    setEditingEducation(null);
    setTempValues({});
  };

  const deleteEducation = (id) => {
    setEducation(education.filter((e) => e.id !== id));
    setShowEducationDropdown(null);
  };

  // Places functions
  const editCurrentCity = () => {
    setEditingCurrentCity(true);
    setTempValues({ currentCity: currentCity || "" });
    setShowCurrentCityDropdown(false);
  };

  const saveCurrentCity = () => {
    setCurrentCity(tempValues.currentCity || "");
    setEditingCurrentCity(false);
    setTempValues({});
  };

  const cancelEditCurrentCity = () => {
    setEditingCurrentCity(false);
    setTempValues({});
  };

  const deleteCurrentCity = () => {
    setCurrentCity("");
    setShowCurrentCityDropdown(false);
  };

  const editHometown = () => {
    setEditingHometown(true);
    setTempValues({ hometown: hometown || "" });
    setShowHometownDropdown(false);
  };

  const saveHometown = () => {
    setHometown(tempValues.hometown || "");
    setEditingHometown(false);
    setTempValues({});
  };

  const cancelEditHometown = () => {
    setEditingHometown(false);
    setTempValues({});
  };

  const deleteHometown = () => {
    setHometown("");
    setShowHometownDropdown(false);
  };

  // Relationship functions
  const editRelationship = () => {
    setEditingRelationship(true);
    setTempValues({ relationship: relationship || "" });
    setShowRelationshipDropdown(false);
  };

  const saveRelationship = () => {
    setRelationship(tempValues.relationship || "");
    setEditingRelationship(false);
    setTempValues({});
  };

  const cancelEditRelationship = () => {
    setEditingRelationship(false);
    setTempValues({});
  };

  const deleteRelationship = () => {
    setRelationship("");
    setShowRelationshipDropdown(false);
  };

  const DropdownMenu = ({ show, onEdit, onDelete, onClose }) => {
    if (!show) return null;

    return (
      <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[120px]">
        <button
          onClick={onEdit}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </button>
      </div>
    );
  };

  const EditableField = ({
    isEditing,
    value,
    tempValue,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    showDropdown,
    onToggleDropdown,
    placeholder,
    addText,
    displayText,
    icon: Icon,
  }) => {
    if (!value && !isEditing) {
      return (
        <button
          onClick={onEdit}
          className="flex items-center text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          {addText}
        </button>
      );
    }

    if (isEditing) {
      return (
        <div className="flex-1 border-2 border-blue-500 rounded-lg p-3 bg-blue-50">
          <input
            type="text"
            placeholder={placeholder}
            value={tempValue || ""}
            onChange={(e) =>
              setTempValues({
                ...tempValues,
                [Object.keys(tempValues)[0]]: e.target.value,
              })
            }
            className="w-full p-2 border border-gray-300 rounded text-sm"
            autoFocus
          />
          <div className="flex items-center mt-3 space-x-2">
            <button
              onClick={onSave}
              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </button>
            <button
              onClick={onCancel}
              className="flex items-center px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between group">
        <div className="flex items-center text-gray-700">
          <Icon className="h-5 w-5 mr-2 text-gray-500" />
          {displayText}
        </div>
        <div className="relative">
          <button
            onClick={onToggleDropdown}
            className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </button>
          <DropdownMenu
            show={showDropdown}
            onEdit={onEdit}
            onDelete={onDelete}
            onClose={() => {}}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow flex min-h-[600px]">
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
        {activeSection === "Work and Education" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Work and Education</h3>

            {/* Work Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Work</h4>
              </div>

              {work.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between mb-3 group"
                >
                  {editingWork === job.id ? (
                    <div className="flex-1 border-2 border-blue-500 rounded-lg p-3 bg-blue-50">
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Job Title"
                          value={tempValues.profession || ""}
                          onChange={(e) =>
                            setTempValues({
                              ...tempValues,
                              profession: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                          autoFocus
                        />
                        <input
                          type="text"
                          placeholder="Company"
                          value={tempValues.company || ""}
                          onChange={(e) =>
                            setTempValues({
                              ...tempValues,
                              company: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                        />
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={tempValues.isWorking || false}
                            onChange={(e) =>
                              setTempValues({
                                ...tempValues,
                                isWorking: e.target.checked,
                              })
                            }
                            className="mr-2"
                          />
                          Currently working here
                        </label>
                      </div>
                      <div className="flex items-center mt-3 space-x-2">
                        <button
                          onClick={saveWork}
                          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Save
                        </button>
                        <button
                          onClick={cancelEditWork}
                          className="flex items-center px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center text-gray-700">
                        <Briefcase className="h-5 w-5 mr-2 text-gray-500" />
                        {job.profession && job.company ? (
                          <span>
                            {job.isWorking ? "Works" : "Worked"} as{" "}
                            {job.profession} at {job.company}
                          </span>
                        ) : (
                          <span className="text-gray-500">
                            Add work information
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowWorkDropdown(
                              showWorkDropdown === job.id ? null : job.id
                            )
                          }
                          className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        </button>
                        <DropdownMenu
                          show={showWorkDropdown === job.id}
                          onEdit={() => editWork(job)}
                          onDelete={() => deleteWork(job.id)}
                          onClose={() => setShowWorkDropdown(null)}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}

              <button
                onClick={addWork}
                className="flex items-center text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add a workplace
              </button>
            </div>

            {/* Education Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Education</h4>
              </div>

              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="flex items-center justify-between mb-3 group"
                >
                  {editingEducation === edu.id ? (
                    <div className="flex-1 border-2 border-blue-500 rounded-lg p-3 bg-blue-50">
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="School"
                          value={tempValues.school || ""}
                          onChange={(e) =>
                            setTempValues({
                              ...tempValues,
                              school: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                          autoFocus
                        />
                        <input
                          type="text"
                          placeholder="Degree"
                          value={tempValues.degree || ""}
                          onChange={(e) =>
                            setTempValues({
                              ...tempValues,
                              degree: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                        />
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={tempValues.isStudying || false}
                            onChange={(e) =>
                              setTempValues({
                                ...tempValues,
                                isStudying: e.target.checked,
                              })
                            }
                            className="mr-2"
                          />
                          Currently studying here
                        </label>
                      </div>
                      <div className="flex items-center mt-3 space-x-2">
                        <button
                          onClick={saveEducation}
                          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Save
                        </button>
                        <button
                          onClick={cancelEditEducation}
                          className="flex items-center px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center text-gray-700">
                        <GraduationCap className="h-5 w-5 mr-2 text-gray-500" />
                        {edu.school && edu.degree ? (
                          <span>
                            {edu.isStudying ? "Studies" : "Studied"}{" "}
                            {edu.degree} at {edu.school}
                          </span>
                        ) : (
                          <span className="text-gray-500">
                            Add education information
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowEducationDropdown(
                              showEducationDropdown === edu.id ? null : edu.id
                            )
                          }
                          className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        </button>
                        <DropdownMenu
                          show={showEducationDropdown === edu.id}
                          onEdit={() => editEducation(edu)}
                          onDelete={() => deleteEducation(edu.id)}
                          onClose={() => setShowEducationDropdown(null)}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}

              <button
                onClick={addEducation}
                className="flex items-center text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add college/university
              </button>
            </div>
          </div>
        )}

        {activeSection === "Places lived" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Places lived</h3>

            {/* Current City */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Current city</h4>
              <EditableField
                isEditing={editingCurrentCity}
                value={currentCity}
                tempValue={tempValues.currentCity}
                onEdit={editCurrentCity}
                onSave={saveCurrentCity}
                onCancel={cancelEditCurrentCity}
                onDelete={deleteCurrentCity}
                showDropdown={showCurrentCityDropdown}
                onToggleDropdown={() =>
                  setShowCurrentCityDropdown(!showCurrentCityDropdown)
                }
                placeholder="Current city"
                addText="Add current city"
                displayText={`Lives in ${currentCity}`}
                icon={MapPin}
              />
            </div>

            {/* Hometown */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Hometown</h4>
              <EditableField
                isEditing={editingHometown}
                value={hometown}
                tempValue={tempValues.hometown}
                onEdit={editHometown}
                onSave={saveHometown}
                onCancel={cancelEditHometown}
                onDelete={deleteHometown}
                showDropdown={showHometownDropdown}
                onToggleDropdown={() =>
                  setShowHometownDropdown(!showHometownDropdown)
                }
                placeholder="Hometown"
                addText="Add hometown"
                displayText={`From ${hometown}`}
                icon={MapPin}
              />
            </div>
          </div>
        )}

        {activeSection === "Family and Relationships" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Family and Relationships
            </h3>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">
                Relationship status
              </h4>
              {relationship || editingRelationship ? (
                <div className="flex items-center justify-between group">
                  {editingRelationship ? (
                    <div className="flex-1 border-2 border-blue-500 rounded-lg p-3 bg-blue-50">
                      <select
                        value={tempValues.relationship || ""}
                        onChange={(e) =>
                          setTempValues({
                            ...tempValues,
                            relationship: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        autoFocus
                      >
                        <option value="">Select relationship status</option>
                        {relationshipOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center mt-3 space-x-2">
                        <button
                          onClick={saveRelationship}
                          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Save
                        </button>
                        <button
                          onClick={cancelEditRelationship}
                          className="flex items-center px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center text-gray-700">
                        <Heart className="h-5 w-5 mr-2 text-gray-500" />
                        {relationship}
                      </div>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowRelationshipDropdown(
                              !showRelationshipDropdown
                            )
                          }
                          className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        </button>
                        <DropdownMenu
                          show={showRelationshipDropdown}
                          onEdit={editRelationship}
                          onDelete={deleteRelationship}
                          onClose={() => setShowRelationshipDropdown(false)}
                        />
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditingRelationship(true);
                    setTempValues({ relationship: "" });
                  }}
                  className="flex items-center text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add relationship status
                </button>
              )}
            </div>
          </div>
        )}

        {activeSection === "Overview" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Overview</h3>
            <p className="text-gray-700">
              Software Developer passionate about coding and traveling.
            </p>
          </div>
        )}

        {activeSection === "Contact and Basic Info" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Contact and Basic Info
            </h3>
            <div className="flex items-center mb-2 text-gray-700">
              <Phone className="h-5 w-5 mr-2 text-gray-500" />
              +84 123 456 789
            </div>
            <div className="flex items-center mb-2 text-gray-700">
              <Mail className="h-5 w-5 mr-2 text-gray-500" />
              {profile?.email}
            </div>
            <div className="flex items-center mb-2 text-gray-700">
              <Calendar className="h-5 w-5 mr-2 text-gray-500" />
              <span>
                Birthday:{" "}
                {profile?.dateOfBirth
                  ? format(parseISO(profile.dateOfBirth), "MMM d, yyyy")
                  : "Not set"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
