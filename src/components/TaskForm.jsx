//TaskForm.jsx
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
  categories,
  addTask,
}) {
  return (
    <div className="bg-white dark:bg-[#6C584C] rounded-xl p-4 mb-4 shadow">
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a task..."
          className="flex-1 p-2 rounded border"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-2 rounded border"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 rounded border"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 rounded border"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          onClick={addTask}
          className="bg-[#8B6F4E] text-white px-4 py-2 rounded hover:bg-[#A78C70]"
        >
          Add
        </button>
      </div>
    </div>
  );
}
