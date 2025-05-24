import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import SheetCard from "./components/SheetCard";
import AddSheetModal from "./components/AddSheetModal";
import CalendarView from "./components/CalendarView";

const defaultSheets = [
  {
    id: "1",
    title: "Yoga Routine",
    subtitle: "Morning Flow ☀️",
    memo: "",
    color: "#DADADA",
    tasks: [
      {
        id: "t1",
        title: "Breathwork",
        completed: false,
        date: "2025-06-01",
        end: "2025-06-01",
        category: "General",
        subtasks: [],
        memo: "",
      },
      {
        id: "t2",
        title: "Sun Salutation",
        completed: false,
        date: "2025-06-02",
        end: "2025-06-02",
        category: "General",
        subtasks: [],
        memo: "",
      },
    ],
  },
  {
    id: "2",
    title: "Trip Planning",
    subtitle: "Weekend Getaway",
    memo: "",
    color: "#BFBFBF",
    tasks: [
      {
        id: "t3",
        title: "Book hotel",
        completed: true,
        date: "2025-06-04",
        end: "2025-06-04",
        category: "General",
        subtasks: [],
        memo: "",
      },
      {
        id: "t4",
        title: "Pack luggage",
        completed: false,
        date: "2025-06-05",
        end: "2025-06-05",
        category: "General",
        subtasks: [],
        memo: "",
      },
    ],
  },
];

export default function ClarityPlanner() {
  const [sheets, setSheets] = useState(() => {
    const saved = localStorage.getItem("sheets");
    return saved ? JSON.parse(saved) : defaultSheets;
  });

  const [selectedSheetIds, setSelectedSheetIds] = useState(() =>
    sheets.length > 0 ? [sheets[0].id] : []
  );
  const [darkMode, setDarkMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    localStorage.setItem("sheets", JSON.stringify(sheets));
  }, [sheets]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleCreateSheet = (newSheet) => {
    setSheets([newSheet, ...sheets]);
    setSelectedSheetIds([newSheet.id, ...selectedSheetIds]); // ← 新規追加を選択中にする
  };

  const handleUpdateSheet = (updatedSheet) => {
    setSheets((prev) =>
      prev.map((s) => (s.id === updatedSheet.id ? updatedSheet : s))
    );
  };

  const handleDeleteSheet = (sheetId) => {
    setSheets(sheets.filter((s) => s.id !== sheetId));
    setSelectedSheetIds((ids) => ids.filter((id) => id !== sheetId));
  };

  const handleUpdateTitle = (sheetId, newTitle) => {
    setSheets((prev) =>
      prev.map((s) => (s.id === sheetId ? { ...s, title: newTitle } : s))
    );
  };

  const handleUpdateSubtitle = (sheetId, newSubtitle) => {
    setSheets((prev) =>
      prev.map((s) => (s.id === sheetId ? { ...s, subtitle: newSubtitle } : s))
    );
  };

  const handleDeleteTask = (sheetId, taskId) => {
    setSheets((prev) =>
      prev.map((s) =>
        s.id === sheetId
          ? { ...s, tasks: s.tasks.filter((t) => t.id !== taskId) }
          : s
      )
    );
  };

  const handleToggleTask = (sheetId, taskId) => {
    setSheets((prev) =>
      prev.map((s) =>
        s.id === sheetId
          ? {
              ...s,
              tasks: s.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
            }
          : s
      )
    );
  };

  const selectedSheets = sheets.filter((s) =>
    selectedSheetIds.includes(s.id)
  );

  return (
    <div className="min-h-screen px-4 py-10 font-raleway bg-[#FAFAFA] text-[#4A4A4A] dark:bg-[#2F2F2F] dark:text-[#ECECEC]">
      <header className="text-center mb-8 relative">
        <h1 className="font-cormorant text-4xl font-bold">Clarity Planner</h1>
        <p className="text-[#A78E74]">From scattered thoughts to structured clarity ✨</p>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="absolute top-0 right-0 mt-2 mr-2 text-[#A78E74] hover:text-[#333]"
          aria-label="Help"
        >
          <QuestionMarkCircleIcon className="w-6 h-6" />
        </button>
      </header>

      {showHelp && (
        <section className="max-w-xl mx-auto mb-10 text-sm text-center text-[#5C4B3B] dark:text-[#D4CABE] border border-[#D9D9D9] p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">How to Use</h2>
          <p className="mb-1">1. Click “+ Add Sheet” to start a new plan.</p>
          <p className="mb-1">2. Give it a title, subtitle, and pick your favorite color.</p>
          <p className="mb-1">3. Click on the sheet to view or hide tasks inside.</p>
          <p className="mb-1">4. Use the calendar below to add, edit, and complete tasks with due dates.</p>
          <p className="mb-1">5. Switch to Dark Mode anytime for better focus.</p>
          <p className="mt-2 italic">Your data is automatically saved in your browser.</p>
        </section>
      )}

      <div className="text-center mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-full px-4 py-2 border border-[#A78E74] hover:bg-[#F0F0F0]"
        >
          + Add Sheet
        </button>
      </div>

      <div className="flex flex-wrap gap-6 justify-center mb-10">
        {sheets.map((sheet) => (
          <SheetCard
            key={sheet.id}
            sheet={sheet}
            onSelect={() =>
              setSelectedSheetIds((prev) =>
                prev.includes(sheet.id)
                  ? prev.filter((id) => id !== sheet.id)
                  : [...prev, sheet.id]
              )
            }
            onDelete={() => handleDeleteSheet(sheet.id)}
            onUpdateTitle={handleUpdateTitle}
            onUpdateSubtitle={handleUpdateSubtitle}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
          />
        ))}
      </div>

      {selectedSheets.length > 0 && (
        <CalendarView
          sheets={selectedSheets}
          onUpdateSheet={handleUpdateSheet}
        />
      )}

      {showAddModal && (
        <AddSheetModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreateSheet}
        />
      )}

      <div className="mt-10 text-center">
        <Switch.Group>
          <Switch.Label className="mr-4">Dark Mode</Switch.Label>
          <Switch
            checked={darkMode}
            onChange={setDarkMode}
            className={`${
              darkMode ? "bg-[#A78E74]" : "bg-[#E6E6E6]"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300`}
          >
            <span
              className={`${
                darkMode ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition duration-300`}
            />
          </Switch>
        </Switch.Group>
      </div>
    </div>
  );
}
