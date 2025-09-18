import { useState } from "react";
import { X } from "lucide-react";

export default function EditInfoModal({ isOpen, setIsOpen }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          {/* Modal */}
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
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder="Enter your city"
                />
              </div>

              {/* Relationship */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Relationship
                </label>
                <select className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:ring focus:ring-blue-200">
                  <option value=""></option>
                  <option>Single</option>
                  <option>In Relationship</option>
                  <option>Engaged</option>
                  <option>Married</option>
                  <option>It's Complicated</option>
                  <option>Prefer not to say</option>
                </select>
              </div>

              {/* Work */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profession
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder="e.g. Google"
                />
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Education
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder="Enter your education"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
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
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder="Enter your hometown"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-4 py-3 flex justify-end">
              <button
                className="px-4 py-3 text-sm font-medium bg-gray-700 text-white rounded-lg shadow cursor-pointer hover:bg-gray-600 active:scale-95 transition"
                onClick={() => setIsOpen(false)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
