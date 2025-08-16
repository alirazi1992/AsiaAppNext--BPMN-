"use client";

import { Dialog } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Process } from "../types/processes.types";
import { v4 as uuidv4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";

import themeStore from "@/app/zustandData/theme.zustand";
import colorStore from "@/app/zustandData/color.zustand";
import useStore from "@/app/hooks/useStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (p: Process) => void;
  existingNames: string[];
}

export default function ProcessModal({ isOpen, onClose, onAdd, existingNames }: Props) {
  const themeMode = useStore(themeStore, (s) => s);
  const color = useStore(colorStore, (s) => s);
  const isDark = !themeMode || themeMode.stateMode;

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (existingNames.some((n) => n.trim().toLowerCase() === name.trim().toLowerCase())) {
      setError("این نام فرآیند قبلاً ثبت شده است.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        const newProcess: Process = { id: uuidv4(), name, description: "", modules: [] };
        onAdd(newProcess);
        setName("");
        onClose();
      } else {
        setError("در ثبت فرآیند مشکلی پیش آمده است.");
      }
    } catch {
      setError("خطا در اتصال به سرور.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} as={Fragment}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <Dialog.Panel
          className={`w-full max-w-md p-6 rounded-md shadow-xl ${
            isDark ? "tableDark lightText" : "tableLight darkText"
          }`}
          dir="rtl"
        >
          <Dialog.Title className="text-xl font-bold text-right mb-4">ثبت فرآیند جدید</Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-right mb-1">نام فرآیند</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full rounded-md px-3 py-2 text-right focus:outline-none focus:ring-1 ${
                  isDark
                    ? "bg-[#22303c] lightText border border-[#2e3b4d] focus:ring-[#607d8b]"
                    : "bg-white darkText border border-[#c9bfb5] focus:ring-[#607d8b]"
                }`}
                required
              />
            </div>

            {error && <p className="text-sm text-red-400 text-right">{error}</p>}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-2 py-1 text-xs rounded border ${
                  isDark ? "lightText border-[#2e3b4d]" : "darkText border-[#c9bfb5]"
                }`}
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-2 py-1 text-xs rounded text-white border border-transparent disabled:opacity-50 flex items-center gap-1 hover:opacity-90"
                style={{ background: color?.color }}
              >
                <AddIcon className="proc-icon" />
                {loading ? "در حال ثبت..." : "ثبت فرآیند"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
