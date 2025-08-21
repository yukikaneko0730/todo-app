// src/components/SheetCard.jsx
import React, { useState, useEffect } from "react";
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
  const [subtitleInput, setSubtitleInput] = useState(sheet.subtitle || "");
  const [isOpen, setIsOpen] = useState(false);

  // Keep inputs in sync when parent updates the sheet
  useEffect(() => {
    setTitleInput(sheet.title);
    setSubtitleInput(sheet.subtitle || "");
  }, [sheet.title, sheet.subtitle]);

  const accent = sheet.color || "var(--btn)";

  const handleSave = (e) => {
    e.stopPropagation();
    onUpdateTitle(sheet.id, titleInput.trim());
    onUpdateSubtitle(sheet.id, subtitleInput.trim());
    setIsEditing(false);
  };

  const toggleOpen = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className="bg-white dark:bg-[var(--surface-dark)] border rounded-2xl shadow-md w-72 hover:shadow-lg transition relative"
      style={{ borderColor: "var(--line)", borderTop: `6px solid ${accent}` }}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect?.()}
      aria-label={`Open sheet ${sheet.title}`}
    >
      {/* Header: title / subtitle / actions */}
      <div className="p-4 pt-5">
        <div className="flex justify-between items-start gap-2">
          <div className="w-full">
            {isEditing ? (
              <>
                <input
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="font-cormorant text-lg font-bold w-full mb-1 border-b bg-transparent outline-none"
                />
                <input
                  value={subtitleInput}
                  onChange={(e) => setSubtitleInput(e.target.value)}
                  className="text-sm w-full border-b bg-transparent outline-none"
                />
              </>
            ) : (
              <>
                <h3 className="font-cormorant text-xl font-semibold text-[var(--text)]">
                  {sheet.title}
                </h3>
                {sheet.subtitle && (
                  <p className="text-sm text-[var(--text-muted)]">{sheet.subtitle}</p>
                )}
              </>
            )}
          </div>

          <div className="flex gap-2 ml-2 shrink-0">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="text-[var(--btn)] hover:text-[var(--btn-hover)]"
                title="Save"
                aria-label="Save"
              >
                <CheckCircle size={18} />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="text-[var(--btn)] hover:text-[var(--btn-hover)]"
                title="Edit"
                aria-label="Edit"
              >
                <Pencil size={18} />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(sheet.id);
              }}
              className="text-[var(--btn)] hover:text-red-600"
              title="Delete sheet"
              aria-label="Delete sheet"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Toggle tasks link */}
        <div className="text-center mt-3">
          <button
            onClick={toggleOpen}
            className="text-sm text-[var(--btn)] hover:text-[var(--btn-hover)] hover:underline"
            aria-expanded={isOpen}
            aria-controls={`sheet-${sheet.id}-tasks`}
          >
            {isOpen ? "Close" : "View Tasks →"}
          </button>
          <span className="ml-2 text-xs text-[var(--text-muted)]">
            {(sheet.tasks || []).length} tasks
          </span>
        </div>

        {/* Task list (linked to sheet color through the top bar only; neutral UI here) */}
        {isOpen && (
          <ul id={`sheet-${sheet.id}-tasks`} className="mt-3 space-y-1">
            {(sheet.tasks || []).map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between bg-[var(--surface)] border rounded px-2 py-1 text-sm"
                style={{ borderColor: "var(--line)" }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTask(sheet.id, task.id);
                  }}
                  className={`flex-1 text-left ${
                    task.completed ? "line-through opacity-60" : ""
                  }`}
                  title="Toggle complete"
                  aria-pressed={!!task.completed}
                >
                  {task.title}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(sheet.id, task.id);
                  }}
                  className="text-[var(--btn)] hover:text-red-600 ml-2"
                  title="Delete task"
                  aria-label="Delete task"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
            {(sheet.tasks || []).length === 0 && (
              <li className="text-xs text-[var(--text-muted)]">No tasks yet</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
