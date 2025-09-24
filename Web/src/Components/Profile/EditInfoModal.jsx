import { useState } from "react";
import { X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { updateBasicInfo } from "../../Redux/Slices/CurrentUserSlice";
export default function EditInfoModal({ isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.currentUser.profile);
  const loading = useSelector((state) => state.currentUser.loading);

  // Controlled states prefilled with current user info
  const [bio, setBio] = useState("");
  const [liveIn, setLiveIn] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phone, setPhone] = useState("");
  const [hometown, setHometown] = useState("");

  const handleSave = async () => {
    const dto = {
      bio,
      currentLocation: liveIn,
      relationshipType: relationship,
      hometown,
    };
    console.log("DTO to be sent:", dto);
    await dispatch(updateBasicInfo(dto));
    setIsOpen(false);
  };
  useEffect(() => {
    if (user) {
      setBio(user?.bio || "");
      setLiveIn(user?.currentLocation || "");
      setRelationship(user?.relationshipType?.name || "");
      setPhone(user?.phone || "");
      setHometown(user?.homeTown || "");
    }
  }, [user]);
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h2 className="text-lg font-semibold">Details</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  rows="2"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder="Write something about yourself..."
                ></textarea>
              </div>

              {/* Live In */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Live In
                </label>
                <input
                  type="text"
                  value={liveIn}
                  onChange={(e) => setLiveIn(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder="Enter your city"
                />
              </div>

              {/* Relationship */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Relationship
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:ring focus:ring-blue-200"
                >
                  <option value="">Relationship</option>
                  <option>Single</option>
                  <option>In Relationship</option>
                  <option>Engaged</option>
                  <option>Married</option>
                  <option>Divorced</option>
                  <option>It's Complicated</option>
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder="Enter your phone"
                />
              </div>

              {/* Hometown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hometown
                </label>
                <input
                  type="text"
                  value={hometown}
                  onChange={(e) => setHometown(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder="Enter your hometown"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-4 py-3 flex justify-end">
              <button
                disabled={loading}
                className={`px-4 py-3 text-sm font-medium rounded-lg shadow cursor-pointer transition ${
                  loading
                    ? "bg-gray-400 text-gray-200"
                    : "bg-gray-700 text-white hover:bg-gray-600 active:scale-95"
                }`}
                onClick={handleSave}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
