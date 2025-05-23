//CalendarView.jsx
import React, { useState } from "react";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { v4 as uuidv4 } from "uuid";


export default function CalendarView({ sheets, onUpdateSheet }) {
  const [input, setInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("General");

  const addTask = () => {
    if (!input.trim() || !sheets[0]) return;
  
    const newTask = {
      id: uuidv4(),
      title: input,
      category,
      date: startDate,
      end: endDate || startDate,
      completed: false,
      subtasks: [],       // ← 追加
      memo: "",           // ← 追加
    };
  
    const updatedSheet = {
      ...sheets[0],
      tasks: [newTask, ...sheets[0].tasks],
    };
  
    onUpdateSheet(updatedSheet);
    setInput("");
    setStartDate("");
    setEndDate("");
  };
  
  const toggleTask = (sheetId, taskId) => {
    const sheet = sheets.find((s) => s.id === sheetId);
    const updatedSheet = {
      ...sheet,
      tasks: sheet.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    };
    onUpdateSheet(updatedSheet);
  };

  const deleteTask = (sheetId, taskId) => {
    const sheet = sheets.find((s) => s.id === sheetId);
    const updatedSheet = {
      ...sheet,
      tasks: sheet.tasks.filter((t) => t.id !== taskId),
    };
    onUpdateSheet(updatedSheet);
  };

  const updateTask = (sheetId, updatedTask) => {
    const sheet = sheets.find((s) => s.id === sheetId);
    const updatedSheet = {
      ...sheet,
      tasks: sheet.tasks.map((t) =>
        t.id === updatedTask.id ? updatedTask : t
      ),
    };
    onUpdateSheet(updatedSheet);
  };

  const onDateClick = (arg) => {
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
    const updatedSheet = {
      ...sheet,
      tasks: sheet.tasks.map((task) =>
        task.id === taskId ? { ...task, date: newStart, end: newEnd } : task
      ),
    };
    onUpdateSheet(updatedSheet);
  };

  const allTasks = sheets.flatMap((sheet) =>
    sheet.tasks.map((task) => ({
      ...task,
      sheetId: sheet.id,
      sheetColor: sheet.color,
    }))
  );

  return (
    <div className="mb-10">
      <h2 className="font-cormorant text-2xl font-bold text-center mb-4">
        Calendar View 📆
      </h2>

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
          categories={["General"]}
          addTask={addTask}
        />
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, multiMonthPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridDay,dayGridWeek,dayGridMonth,multiMonthYear",
        }}
        views={{
          multiMonthYear: {
            type: "multiMonth",
            duration: { months: 12 },
            buttonText: "Year",
          },
        }}
        editable={true}
        selectable={true}
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
        className="bg-white rounded-lg p-2 shadow-md mb-6"
      />

      <div>
        {sheets.map((sheet) => (
          <div key={sheet.id} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">
              {sheet.title} — {sheet.subtitle}
            </h3>
            <ul className="space-y-2">
              {sheet.tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(sheet.id, task.id)}
                  onDelete={() => deleteTask(sheet.id, task.id)}
                  onUpdate={(id, updated) => updateTask(sheet.id, updated)}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
