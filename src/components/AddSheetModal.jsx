// AddSheetModal.jsx
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const earthColors = [
  "#F9F5F0", "#EFE7DD", "#8B6F4E", "#CBAA8A", "#A3B18A",
  "#C86B48", "#A15C58", "#A78C70", "#D9CFC1", "#D6A75D"
];

export default function AddSheetModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [color, setColor] = useState(earthColors[0]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    const newSheet = {
      id: uuidv4(),
      title,
      subtitle,
      color,
      tasks: [],
    };
    onCreate(newSheet);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="font-cormorant text-2xl mb-4">Add New Sheet</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <div className="mb-4">
          <p className="text-sm mb-1">Choose Color</p>
          <div className="flex flex-wrap gap-2">
            {earthColors.map((c) => (
              <button
                key={c}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 ${
                  color === c ? "border-black" : "border-transparent"
                }`}
              ></button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-[#8B6F4E] text-white hover:bg-[#A78C70]"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
