"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Process } from "../types/processes.types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PaletteIcon from "@mui/icons-material/Palette";

import themeStore from "@/app/zustandData/theme.zustand";
import colorStore from "@/app/zustandData/color.zustand";
import useStore from "@/app/hooks/useStore";

interface Props {
  data: Process[];
  onDelete: (id: string) => void;
  onEdit: (p: Process) => void;
}

export default function ProcessTable({ data, onDelete, onEdit }: Props) {
  const router = useRouter();
  const themeMode = useStore(themeStore, (s) => s);
  const color = useStore(colorStore, (s) => s);
  const isDark = !themeMode || themeMode.stateMode;

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const pageData = useMemo(() => data.slice(startIndex, startIndex + rowsPerPage), [data, startIndex]);

  const toFa = (n: number) => n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

  if (data.length === 0) {
    return (
      <div className={`p-3 rounded-lg text-center text-sm ${isDark ? "tableDark lightText" : "tableLight darkText"}`}>
        هیچ فرآیندی ثبت نشده است.
      </div>
    );
  }

  return (
    <>
      {/* icon hover animation only for this table (does NOT affect other files) */}
      <style jsx>{`
        @keyframes shake {
          0% {
            transform: translateX(0) rotate(0);
          }
          25% {
            transform: translateX(-2px) rotate(-5deg);
          }
          50% {
            transform: translateX(2px) rotate(5deg);
          }
          75% {
            transform: translateX(-2px) rotate(-5deg);
          }
          100% {
            transform: translateX(0) rotate(0);
          }
        }
        .proc-action:hover .proc-icon {
          animation: shake 0.4s ease-in-out infinite;
        }
      `}</style>

      <div className="overflow-x-auto">
        <div className={`${isDark ? "rounded-lg shadow-sm tableDark" : "rounded-lg shadow-sm tableLight border"}`}>
          {/* header */}
          <div
            className={`hidden md:grid md:grid-cols-12 gap-2 px-3 py-2 text-xs font-semibold ${
              isDark ? "contentDark lightText" : "contentLight darkText border-b"
            }`}
          >
            <div className="md:col-span-1 text-center">#</div>
            <div className="md:col-span-3">نام فرآیند</div>
            <div className="md:col-span-4">توضیحات</div>
            <div className="md:col-span-3">ماژول‌ها</div>
            <div className="md:col-span-1 text-center">عملیات</div>
          </div>

          {/* rows */}
          <div className="max-h-[800px] overflow-y-auto" style={{ direction: "ltr" }}>
            <div style={{ direction: "rtl" }}>
              {pageData.map((proc, idx) => {
                const rowBg = isDark
                  ? idx % 2 === 0
                    ? "bg-[#1b2b39]"
                    : "bg-[#2a3d4e]"
                  : idx % 2 === 0
                  ? "bg-[#e9e2db]"
                  : "bg-[#ded6ce]";

                return (
                  <div key={proc.id}>
                    <div
                      className={`grid grid-cols-1 md:grid-cols-12 gap-2 px-3 py-1.5 ${rowBg} ${
                        isDark ? "lightText" : "darkText border-b border-[#c9bfb5]"
                      }`}
                    >
                      <div className="md:col-span-1 text-center">{toFa(startIndex + idx + 1)}</div>
                      <div className="md:col-span-3 font-medium">{proc.name}</div>
                      <div className="md:col-span-4">{proc.description}</div>
                      <div className="md:col-span-3">
                        {(proc.modules?.length ?? 0) > 0 ? (
                          <ul className="list-disc pr-4 space-y-0.5">
                            {proc.modules!.map((m, i) => (
                              <li key={i}>
                                <span className="font-semibold">{m.title}</span> — {m.owner}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="opacity-70">—</span>
                        )}
                      </div>

                      <div className="md:col-span-1 flex items-center justify-center gap-1">
                        <button
                          onClick={() => onDelete(proc.id)}
                          className="proc-action group w-7 h-7 rounded-md flex items-center justify-center"
                          style={{ background: color?.color, color: "white" }}
                          title="حذف"
                        >
                          <DeleteIcon className="proc-icon transition-transform" />
                        </button>

                        <button
                          onClick={() => onEdit(proc)}
                          className="proc-action group w-7 h-7 rounded-md flex items-center justify-center"
                          style={{ background: color?.color, color: "white" }}
                          title="ویرایش"
                        >
                          <EditIcon className="proc-icon transition-transform" />
                        </button>

                        {/* DESIGN → navigate to dedicated page */}
                        <button
                          onClick={() => router.push(`/Home/process/processes/design/${proc.id}`)}
                          className="proc-action group w-7 h-7 rounded-md flex items-center justify-center"
                          style={{ background: color?.color, color: "white" }}
                          title="طراحی BPMN"
                        >
                          <PaletteIcon className="proc-icon transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 text-xs rounded text-white disabled:opacity-50"
                style={{ background: color?.color }}
              >
                قبلی
              </button>
              <span className={`${isDark ? "lightText" : "darkText"} text-xs`}>
                صفحه {currentPage} از {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 text-xs rounded text-white disabled:opacity-50"
                style={{ background: color?.color }}
              >
                بعدی
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
