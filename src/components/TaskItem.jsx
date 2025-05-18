// TaskItem.jsx
import React, { useState, useRef, useEffect } from "react";
import { Trash2, Edit3, Check } from "lucide-react";

export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const inputRef = useRef();

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const handleSave = () => {
    if (newTitle.trim() && newTitle !== task.title) {
      onUpdate(task.id, { ...task, title: newTitle });
    }
    setEditing(false);
  };

  return (
    <li className="flex items-center justify-between bg-[#EFE7DD] rounded px-3 py-2 text-sm">
      <div className="flex items-center gap-2 flex-1">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="accent-[#8B6F4E]"
        />

        {editing ? (
          <input
            ref={inputRef}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="flex-1 bg-transparent border-b border-gray-400 outline-none"
          />
        ) : (
          <span
            onDoubleClick={() => setEditing(true)}
            className={`flex-1 cursor-pointer ${
              task.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {task.title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-[#8B6F4E] hover:text-black"
            title="Edit"
          >
            <Edit3 size={16} />
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="text-[#A15C58] hover:text-red-600"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}
