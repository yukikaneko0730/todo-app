// src/components/TaskItem.jsx
import React, { useState, useRef, useEffect } from "react";
import { Trash2, Edit3 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onUpdate,
  accentColor, // optional
}) {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [newSubInput, setNewSubInput] = useState("");
  const inputRef = useRef(null);

  // Autofocus when entering edit mode
  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  // Save main task title
  const handleSave = () => {
    const title = newTitle.trim();
    if (title && title !== task.title) {
      onUpdate(task.id, { ...task, title });
    }
    setEditing(false);
  };

  // Subtasks: toggle / edit / delete / add
  const handleToggleSubtask = (subId) => {
    const updated = (task.subtasks || []).map((s) =>
      s.id === subId ? { ...s, done: !s.done } : s
    );
    onUpdate(task.id, { ...task, subtasks: updated });
  };

  const handleEditSubtask = (subId, title) => {
    const updated = (task.subtasks || []).map((s) =>
      s.id === subId ? { ...s, title } : s
    );
    onUpdate(task.id, { ...task, subtasks: updated });
  };

  const handleDeleteSubtask = (subId) => {
    const updated = (task.subtasks || []).filter((s) => s.id !== subId);
    onUpdate(task.id, { ...task, subtasks: updated });
  };

  const handleAddSubtask = () => {
    const title = newSubInput.trim();
    if (!title) return;
    const newSub = { id: uuidv4(), title, done: false };
    const updated = [...(task.subtasks || []), newSub];
    onUpdate(task.id, { ...task, subtasks: updated });
    setNewSubInput("");
  };

  return (
    <li
      className="rounded p-3 text-sm space-y-3 border"
      style={{ background: "var(--surface)", borderColor: "var(--line)" }}
    >
      {/* Title & actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="accent-[var(--btn)]"
            style={{ accentColor: "var(--btn)" }}
            aria-label="Toggle complete"
          />

          {editing ? (
            <input
              ref={inputRef}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="flex-1 bg-transparent border-b border-[var(--line)] outline-none"
              aria-label="Edit task title"
            />
          ) : (
            <span
              onDoubleClick={() => setEditing(true)}
              className={`flex-1 cursor-pointer ${
                task.completed ? "line-through opacity-60" : ""
              }`}
              title="Double-click to edit"
            >
              {task.title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-[var(--btn)] hover:text-[var(--btn-hover)]"
              title="Edit task"
              aria-label="Edit task"
            >
              <Edit3 size={16} />
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            className="text-[var(--btn)] hover:text-red-600"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Subtasks */}
      {(task.subtasks || []).length > 0 && (
        <ul className="ml-6 space-y-1">
          {task.subtasks.map((sub) => (
            <li key={sub.id} className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 flex-1">
                <input
                  type="checkbox"
                  checked={sub.done}
                  onChange={() => handleToggleSubtask(sub.id)}
                  className="accent-[var(--btn)]"
                  style={{ accentColor: "var(--btn)" }}
                  aria-label="Toggle subtask complete"
                />
                <span className={sub.done ? "line-through opacity-60" : ""}>
                  {sub.title}
                </span>
              </label>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    const t = window.prompt("Edit subtask", sub.title);
                    if (t !== null) handleEditSubtask(sub.id, t);
                  }}
                  className="text-[var(--btn)] hover:text-[var(--btn-hover)]"
                  title="Edit subtask"
                  aria-label="Edit subtask"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteSubtask(sub.id)}
                  className="text-[var(--btn)] hover:text-red-600"
                  title="Delete subtask"
                  aria-label="Delete subtask"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* New subtask input */}
      <div className="ml-6 mt-2 flex items-center gap-2">
        <input
          type="text"
          value={newSubInput}
          onChange={(e) => setNewSubInput(e.target.value)}
          placeholder="New subtask"
          className="p-1 border rounded text-sm flex-1"
          aria-label="New subtask"
        />
        <button
          onClick={handleAddSubtask}
          className="text-xs text-[var(--btn)] hover:text-[var(--btn-hover)] hover:underline"
          aria-label="Add subtask"
        >
          Add
        </button>
      </div>

      {/* Memo (always visible) */}
      <textarea
        className="w-full mt-3 p-2 text-sm border rounded"
        placeholder="Memo..."
        value={task.memo || ""}
        onChange={(e) => onUpdate(task.id, { ...task, memo: e.target.value })}
        aria-label="Memo"
      />
    </li>
  );
}
