// src/components/CalendarView.jsx
import React, { useState, useMemo, useEffect } from "react";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { v4 as uuidv4 } from "uuid";

/** hex -> rgba (for soft tinted backgrounds) */
const hexToRGBA = (hex, alpha = 0.14) => {
  if (!hex) return `rgba(166,166,166,${alpha})`;
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length < 6) return `rgba(166,166,166,${alpha})`;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function CalendarView({ sheets, onUpdateSheet }) {
  const [input, setInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // UI keeps using sheet title as "category"
  const [category, setCategory] = useState(sheets[0]?.title || "");

  /** normalize date: dd.mm.yyyy or yyyy-mm-dd -> yyyy-mm-dd */
  const toISO = (value) => {
    if (!value) return "";
    const v = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v; // already ISO
    const m = v.match(/^(\d{2})\.(\d{2})\.(\d{4})$/); // dd.mm.yyyy
    if (m) return `${m[3]}-${m[2]}-${m[1]}`;
    const d = new Date(v);
    if (!isNaN(d)) return d.toISOString().slice(0, 10);
    return "";
  };

  /** keep category valid when sheets change */
  useEffect(() => {
    if (!sheets.find((s) => s.title === category) && sheets[0]) {
      setCategory(sheets[0].title);
    }
  }, [sheets, category]);

  const addTask = () => {
    const title = input.trim();
    const isoStart = toISO(startDate);
    const isoEnd = toISO(endDate || startDate);

    if (!title) return alert("Please enter a task title.");
    if (!category) return alert("Please choose a sheet.");
    if (!isoStart) return alert("Start date is invalid. Use yyyy-mm-dd or dd.mm.yyyy.");
    if (!isoEnd) return alert("End date is invalid. Use yyyy-mm-dd or dd.mm.yyyy.");

    const targetSheet = sheets.find((s) => s.title === category);
    if (!targetSheet) return alert("Selected sheet not found.");

    const newTask = {
      id: uuidv4(),
      title,
      category,
      date: isoStart,
      end: isoEnd,
      completed: false,
      subtasks: [],
      memo: "",
    };

    const updatedSheet = { ...targetSheet, tasks: [newTask, ...(targetSheet.tasks || [])] };
    onUpdateSheet(updatedSheet);

    // clear inputs
    setInput("");
    setStartDate("");
    setEndDate("");
  };

  const toggleTask = (sheetId, taskId) => {
    const sheet = sheets.find((s) => s.id === sheetId);
    if (!sheet) return;
    const updatedSheet = {
      ...sheet,
      tasks: sheet.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
    };
    onUpdateSheet(updatedSheet);
  };

  const deleteTask = (sheetId, taskId) => {
    const sheet = sheets.find((s) => s.id === sheetId);
    if (!sheet) return;
    const updatedSheet = { ...sheet, tasks: sheet.tasks.filter((t) => t.id !== taskId) };
    onUpdateSheet(updatedSheet);
  };

  const updateTask = (sheetId, updatedTask) => {
    const sheet = sheets.find((s) => s.id === sheetId);
    if (!sheet) return;
    const updatedSheet = {
      ...sheet,
      tasks: sheet.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    };
    onUpdateSheet(updatedSheet);
  };

  const onDateClick = (arg) => {
    // FullCalendar provides ISO (yyyy-mm-dd)
    setStartDate(arg.dateStr);
    setEndDate(arg.dateStr);
  };

  const onEventDrop = (info) => {
    const { event } = info;
    const taskId = event.id;
    const sheetId = event.extendedProps.sheetId;
    const newStart = event.startStr;
    const newEnd = event.endStr || newStart;

    const sheet = sheets.find((s) => s.id === sheetId);
    if (!sheet) return;

    const updatedSheet = {
      ...sheet,
      tasks: sheet.tasks.map((task) =>
        task.id === taskId ? { ...task, date: newStart, end: newEnd } : task
      ),
    };
    onUpdateSheet(updatedSheet);
  };

  const allTasks = useMemo(
    () =>
      sheets.flatMap((sheet) =>
        (sheet.tasks || []).map((task) => ({
          ...task,
          sheetId: sheet.id,
          sheetColor: sheet.color,
        }))
      ),
    [sheets]
  );

  return (
    <div className="mb-10">
      <h2 className="font-cormorant text-2xl font-bold text-center mb-4">Calendar View 📆</h2>

      <div className="mb-6">
        <TaskForm
          input={input}
          setInput={setInput}
          dueDate={startDate}
          setDueDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          category={category}
          setCategory={setCategory}
          categories={sheets.map((sheet) => sheet.title)}
          addTask={addTask}
          placeholders={{
            title: "Enter a task...",
            start: "yyyy-mm-dd or dd.mm.yyyy",
            end: "yyyy-mm-dd or dd.mm.yyyy",
          }}
        />
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg p-2 shadow-md mb-6 cp-calendar">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, multiMonthPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridDay,dayGridWeek,dayGridMonth,multiMonthYear",
          }}
          buttonText={{
            today: "today",
            month: "month",
            week: "week",
            day: "day",
            Year: "Year",
            prev: "←",
            next: "→",
          }}
          views={{
            multiMonthYear: { type: "multiMonth", duration: { months: 12 }, buttonText: "Year" },
          }}
          editable
          selectable
          events={allTasks
            .filter((t) => t.date)
            .map((task) => ({
              id: task.id,
              title: task.title,
              start: task.date,
              end: task.end,
              backgroundColor: task.sheetColor,
              borderColor: task.sheetColor,
              textColor: "white",
              sheetId: task.sheetId,
            }))}
          dateClick={onDateClick}
          eventDrop={onEventDrop}
          height="auto"
        />
      </div>

      {/* Sheet-colored detail panels */}
      <div>
        {sheets.map((sheet) => {
          const accent = sheet.color || "#A6A6A6";
          return (
            <div key={sheet.id} className="mb-6">
              <div
                className="rounded-xl p-4 border"
                style={{
                  borderColor: accent,
                  background: hexToRGBA(accent, 0.14),
                }}
              >
                <h3 className="text-xl font-semibold mb-3" style={{ color: accent }}>
                  {sheet.title} —{" "}
                  <span className="font-normal opacity-80">{sheet.subtitle}</span>
                </h3>

                <ul className="space-y-2">
                  {(sheet.tasks || []).map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={() => toggleTask(sheet.id, task.id)}
                      onDelete={() => deleteTask(sheet.id, task.id)}
                      onUpdate={(id, updated) => updateTask(sheet.id, updated)}
                      accentColor={accent} /* optional */
                    />
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
