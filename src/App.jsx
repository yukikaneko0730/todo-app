// App.jsx
import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import SheetCard from "./components/SheetCard";
import AddSheetModal from "./components/AddSheetModal";
import CalendarView from "./components/CalendarView";

const defaultSheets = [
  {
    id: "1",
    title: "Yoga Routine",
    subtitle: "Morning Flow ☀️",
    color: "#A3B18A",
    tasks: [
      { id: "t1", title: "Breathwork", completed: false, date: "2025-06-01" },
      { id: "t2", title: "Sun Salutation", completed: false, date: "2025-06-02" },
    ],
  },
  {
    id: "2",
    title: "Trip Planning",
    subtitle: "Weekend Getaway",
    color: "#C86B48",
    tasks: [
      { id: "t3", title: "Book hotel", completed: true, date: "2025-06-04" },
      { id: "t4", title: "Pack luggage", completed: false, date: "2025-06-05" },
    ],
  },
];

export default function TodoApp() {
  const [sheets, setSheets] = useState(() => {
    const saved = localStorage.getItem("sheets");
    return saved ? JSON.parse(saved) : defaultSheets;
  });
  const [selectedSheetIds, setSelectedSheetIds] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("sheets", JSON.stringify(sheets));
  }, [sheets]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleCreateSheet = (newSheet) => {
    setSheets([newSheet, ...sheets]);
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

  const selectedSheets = sheets.filter((s) => selectedSheetIds.includes(s.id));

  return (
    <div className="min-h-screen px-4 py-10 font-raleway bg-[#F9F5F0] text-[#4E4035] dark:bg-[#4E4035] dark:text-[#EFE7DD]">
      <header className="text-center mb-8">
        <h1 className="font-cormorant text-4xl font-bold">My Lovely ToDo</h1>
        <p className="text-[#CBAA8A]">Sheets + Calendar Integrated ✨</p>
      </header>

      <div className="text-center mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-full px-4 py-2 border border-[#8B6F4E] hover:bg-[#EFE7DD]"
        >
          + Add Sheet
        </button>
      </div>

      <div className="flex flex-wrap gap-6 justify-center mb-10">
        {sheets.map((sheet) => (
          <SheetCard
            key={sheet.id}
            sheet={sheet}
            onSelect={() => {
              setSelectedSheetIds((prev) =>
                prev.includes(sheet.id)
                  ? prev.filter((id) => id !== sheet.id)
                  : [...prev, sheet.id]
              );
            }}
            onDelete={() => handleDeleteSheet(sheet.id)}
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
              darkMode ? "bg-[#8B6F4E]" : "bg-[#EFE7DD]"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`$${
                darkMode ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </Switch.Group>
      </div>
    </div>
  );
}
