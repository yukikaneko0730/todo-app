// TaskItem.jsx
import React, { useState, useRef, useEffect } from "react";
import { Trash2, Edit3 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const inputRef = useRef();
  const [newSubInput, setNewSubInput] = useState("");

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const handleSave = () => {
    if (newTitle.trim() && newTitle !== task.title) {
      onUpdate(task.id, { ...task, title: newTitle });
    }
    setEditing(false);
  };

  const handleToggleSubtask = (subId) => {
    const updatedSubtasks = task.subtasks.map((s) =>
      s.id === subId ? { ...s, done: !s.done } : s
    );
    onUpdate(task.id, { ...task, subtasks: updatedSubtasks });
  };

  const handleEditSubtask = (subId, newTitle) => {
    const updatedSubtasks = task.subtasks.map((s) =>
      s.id === subId ? { ...s, title: newTitle } : s
    );
    onUpdate(task.id, { ...task, subtasks: updatedSubtasks });
  };

  const handleDeleteSubtask = (subId) => {
    const updatedSubtasks = task.subtasks.filter((s) => s.id !== subId);
    onUpdate(task.id, { ...task, subtasks: updatedSubtasks });
  };

  const handleAddSubtask = () => {
    if (!newSubInput.trim()) return;
    const newSub = {
      id: uuidv4(),
      title: newSubInput.trim(),
      done: false,
    };
    const updatedSubtasks = [...(task.subtasks || []), newSub];
    onUpdate(task.id, { ...task, subtasks: updatedSubtasks });
    setNewSubInput("");
  };

  return (
    <li className="bg-[#EFE7DD] rounded p-3 text-sm space-y-3">
      {/* タイトルとアクション */}
      <div className="flex items-center justify-between">
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
      </div>

      {/* サブタスク一覧 */}
      {task.subtasks && task.subtasks.length > 0 && (
        <ul className="ml-6 space-y-1">
          {task.subtasks.map((sub) => (
            <li
              key={sub.id}
              className="flex items-center justify-between text-sm"
            >
              <label className="flex items-center gap-2 flex-1">
                <input
                  type="checkbox"
                  checked={sub.done}
                  onChange={() => handleToggleSubtask(sub.id)}
                />
                <span className={sub.done ? "line-through text-gray-400" : ""}>
                  {sub.title}
                </span>
              </label>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    const newTitle = prompt("Edit subtask", sub.title);
                    if (newTitle) handleEditSubtask(sub.id, newTitle);
                  }}
                >
                  ✏️
                </button>
                <button onClick={() => handleDeleteSubtask(sub.id)}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 新規サブタスク入力欄 */}
      <div className="ml-6 mt-2 flex items-center gap-2">
        <input
          type="text"
          value={newSubInput}
          onChange={(e) => setNewSubInput(e.target.value)}
          placeholder="New subtask"
          className="p-1 border rounded text-sm flex-1"
        />
        <button
          onClick={handleAddSubtask}
          className="text-xs text-[#8B6F4E] hover:underline"
        >
          Add
        </button>
      </div>

      {/* メモ欄（常時表示） */}
      <textarea
        className="w-full mt-3 p-2 text-sm border rounded"
        placeholder="Memo..."
        value={task.memo || ""}
        onChange={(e) => onUpdate(task.id, { ...task, memo: e.target.value })}
      />
    </li>
  );
}
