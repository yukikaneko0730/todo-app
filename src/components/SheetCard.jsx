import React, { useState } from "react";
import { Pencil, Trash2, CheckCircle } from "lucide-react";

export default function SheetCard({
  sheet,
  onSelect,
  onDelete,
  onToggleTask,
  onDeleteTask,
  onUpdateTitle,
  onUpdateSubtitle,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(sheet.title);
  const [subtitleInput, setSubtitleInput] = useState(sheet.subtitle);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (e) => {
    e.stopPropagation();
    onUpdateTitle(sheet.id, titleInput);
    onUpdateSubtitle(sheet.id, subtitleInput);
    setIsEditing(false);
  };

  const toggleOpen = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className="bg-white dark:bg-[#6C584C] p-4 rounded-2xl shadow-md w-72 hover:shadow-lg transition relative"
      style={{ borderTop: `6px solid ${sheet.color}` }}
    >
      {/* タイトル・編集UI */}
      <div className="flex justify-between items-start mb-2">
        <div className="w-full">
          {isEditing ? (
            <>
              <input
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="font-cormorant text-lg font-bold w-full mb-1 border-b bg-transparent"
              />
              <input
                value={subtitleInput}
                onChange={(e) => setSubtitleInput(e.target.value)}
                className="text-sm w-full border-b bg-transparent"
              />
            </>
          ) : (
            <>
              <h3 className="font-cormorant text-xl font-semibold">
                {sheet.title}
              </h3>
              <p className="text-sm text-[#CBAA8A]">{sheet.subtitle}</p>
            </>
          )}
        </div>

        <div className="flex gap-2 ml-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="text-green-600 hover:text-green-800"
              title="Save"
            >
              <CheckCircle size={18} />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="text-[#8B6F4E] hover:text-black"
              title="Edit"
            >
              <Pencil size={18} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(sheet.id);
            }}
            className="text-[#A15C58] hover:text-red-600"
            title="Delete Sheet"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* タスク一覧 */}
      {isOpen && (
        <ul className="mt-2 space-y-1">
          {sheet.tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between bg-[#EFE7DD] dark:bg-[#8B6F4E] rounded px-2 py-1 text-sm"
            >
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTask(sheet.id, task.id);
                }}
                className={`flex-1 cursor-pointer ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTask(sheet.id, task.id);
                }}
                className="text-[#A15C58] hover:text-red-600 ml-2"
                title="Delete Task"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* View / Close ボタン */}
      <div className="text-center mt-4">
        <button
          onClick={toggleOpen}
          className="text-sm text-[#8B6F4E] hover:underline"
        >
          {isOpen ? "Close" : "View Tasks →"}
        </button>
      </div>
    </div>
  );
}
