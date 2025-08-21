// src/components/TaskForm.jsx
import React from "react";

export default function TaskForm({
  input,
  setInput,
  dueDate,
  setDueDate,
  endDate,
  setEndDate,
  category,
  setCategory,
  categories = [],
  addTask,
}) {
  const onSubmit = (e) => {
    e.preventDefault();
    addTask();
  };

  return (
    <form onSubmit={onSubmit} className="cp-toolbar rounded-xl mb-4 shadow-none">
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter Task"
          className="cp-input flex-1 min-w-[220px]"
          aria-label="Task title"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="cp-input w-[160px]"
          aria-label="Start date"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="cp-input w-[160px]"
          aria-label="End date"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="cp-select w-[160px]"
          aria-label="Sheet"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        
        <button type="submit" className="cp-btn-gray">
          Add
        </button>
      </div>
    </form>
  );
}
