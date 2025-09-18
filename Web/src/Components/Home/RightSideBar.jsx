import React from "react";

const contacts = [
  { name: "Meta AI", online: true },
  { name: "Nguyễn Khoa", online: true },
  { name: "Trí Vũ", online: false },
  { name: "Thanh Vân", online: true },
  { name: "Meta AI", online: true },
  { name: "Nguyễn Khoa", online: true },
  { name: "Trí Vũ", online: false },
  { name: "Thanh Vân", online: true },
  { name: "Meta AI", online: true },
  { name: "Nguyễn Khoa", online: true },
  { name: "Trí Vũ", online: false },
  { name: "Thanh Vân", online: true },
  { name: "Meta AI", online: true },
  { name: "Nguyễn Khoa", online: true },
  { name: "Trí Vũ", online: false },
  { name: "Thanh Vân", online: true },
  { name: "Meta AI", online: true },
  { name: "Nguyễn Khoa", online: true },
  { name: "Trí Vũ", online: false },
  { name: "Thanh Vân", online: true },
  { name: "Meta AI", online: true },
  { name: "Nguyễn Khoa", online: true },
  { name: "Trí Vũ", online: false },
  { name: "Thanh Vân", online: true },
];

export default function RightSidebar() {
  return (
    <div className="">
      <h2 className="font-semibold mb-2">Contacts</h2>
      <div className="space-y-2">
        {contacts.map((c, i) => (
          <div key={i} className="flex items-center space-x-2">
            <img
              src={`https://ui-avatars.com/api/?name=${c.name}`}
              alt={c.name}
              className="w-8 h-8 rounded-full"
            />
            <span>{c.name}</span>
            {c.online && (
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
