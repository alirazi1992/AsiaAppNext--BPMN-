"use client";

import { useEffect, useState } from "react";
import { Process } from "../types/processes.types";
import ProcessTable from "./ProcessTable";
import ProcessModal from "./ProcessModal";
import SearchIcon from "@mui/icons-material/Search";

import themeStore from "@/app/zustandData/theme.zustand";
import useStore from "@/app/hooks/useStore";
import colorStore from "@/app/zustandData/color.zustand";

const ProcessesContainer = () => {
  const themeMode = useStore(themeStore, (s) => s);
  const color = useStore(colorStore, (s) => s);
  const isDark = !themeMode || themeMode.stateMode;

  const [processes, setProcesses] = useState<Process[]>([]);
  const [filteredProcesses, setFilteredProcesses] = useState<Process[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [processToEdit, setProcessToEdit] = useState<Process | null>(null);

  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async () => {
    try {
      const res = await fetch("/api/process");
      const data = await res.json();
      setProcesses(data);
      setFilteredProcesses(data);
    } catch (error) {
      console.error("Failed to fetch processes", error);
    }
  };

  const handleAddProcess = (newProcess: Process) => {
    setProcesses((prev) => [newProcess, ...prev]);
    setFilteredProcesses((prev) => [newProcess, ...prev]);
  };

  const handleEditProcess = (updated: Process) => {
    setProcesses((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setFilteredProcesses((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setShowEditModal(false);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredProcesses(processes);
      return;
    }
    const filtered = processes.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProcesses(filtered);
  };

  const openEditModal = (process: Process) => {
    setProcessToEdit(process);
    setShowEditModal(true);
  };

  return (
    <div className={`p-4 ${isDark ? "contentDark" : "contentLight"}`} dir="rtl">
      {/* Page Title */}
      <h1 className={`text-2xl font-bold mb-6 text-right ${isDark ? "lightText" : "darkText"}`}>فرآیندها</h1>

      {/* Add Button + Search */}
      <div className="flex justify-between items-center mb-6">
        {/* Add Button (left) */}
        <button
          onClick={() => setShowAddModal(true)}
          className={`w-10 h-10 rounded-md text-lg flex items-center justify-center hover:opacity-90 ${
            isDark ? "lightText" : "lightText"
          }`}
          style={{ background: color?.color }}
          title="افزودن فرآیند"
        >
          +
        </button>

        {/* Search (right) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSearch}
            className={`w-10 h-10 rounded-md flex items-center justify-center hover:opacity-90 ${
              isDark ? "lightText" : "lightText"
            }`}
            style={{ background: color?.color }}
            title="جستجو"
          >
            <SearchIcon className="proc-icon" />
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!e.target.value.trim()) setFilteredProcesses(processes);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="جستجوی فرآیند..."
            className={`w-56 px-4 py-2 rounded-md focus:outline-none ${
              isDark ? "bg-[#1b2b39] lightText border border-[#2e3b4d]" : "bg-white darkText border border-[#c9bfb5]"
            }`}
          />
        </div>
      </div>

      {/* Table */}
      <ProcessTable
        data={filteredProcesses}
        onDelete={(id) => {
          setProcesses((prev) => prev.filter((p) => p.id !== id));
          setFilteredProcesses((prev) => prev.filter((p) => p.id !== id));
        }}
        onEdit={openEditModal}
      />

      {/* Add Modal */}
      {showAddModal && (
        <ProcessModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProcess}
          existingNames={processes.map((p) => p.name)}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && processToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className={`rounded-lg p-6 w-full max-w-sm ${isDark ? "tableDark lightText" : "tableLight darkText"}`}
            dir="rtl"
          >
            <h2 className="text-lg font-bold mb-4">ویرایش فرآیند</h2>

            <label className="block text-sm mb-1">نام فرآیند:</label>
            <input
              type="text"
              value={processToEdit.name}
              onChange={(e) => setProcessToEdit({ ...processToEdit, name: e.target.value })}
              className={`w-full rounded px-3 py-1 mb-3 border ${
                isDark ? "bg-[#0f1724] lightText border-[#2e3b4d]" : "bg-white darkText border-[#c9bfb5]"
              }`}
            />

            <label className="block text-sm mb-1">توضیحات:</label>
            <textarea
              value={processToEdit.description || ""}
              onChange={(e) => setProcessToEdit({ ...processToEdit, description: e.target.value })}
              className={`w-full rounded px-3 py-1 mb-4 border ${
                isDark ? "bg-[#0f1724] lightText border-[#2e3b4d]" : "bg-white darkText border-[#c9bfb5]"
              }`}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className={`px-3 py-1 rounded border ${
                  isDark ? "lightText border-[#2e3b4d]" : "darkText border-[#c9bfb5]"
                }`}
              >
                انصراف
              </button>
              <button
                onClick={() => processToEdit && handleEditProcess(processToEdit)}
                className="px-3 py-1 rounded text-white"
                style={{ background: color?.color }}
              >
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessesContainer;
