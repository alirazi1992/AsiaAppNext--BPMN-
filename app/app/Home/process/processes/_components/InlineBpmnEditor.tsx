"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";

// bpmn-js UI (palette/context pad/icons)
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

// Properties Panel CSS
import "@bpmn-io/properties-panel/dist/assets/properties-panel.css";

// ✅ Import modules as namespaces to work across versions/exports
import * as PropertiesPanelModule from "@bpmn-io/properties-panel";
import * as BpmnPropertiesProviderModule from "bpmn-js-properties-panel";

interface InlineBpmnEditorProps {
  processId: string;
  defaultTemplate?: string;
}

const TEMPLATES: { label: string; file: string }[] = [
  { label: "الگوی خالی", file: "blank.bpmn" },
  { label: "انواع فعالیت‌ها", file: "all_activity_types.bpmn" },
  { label: "مرز رویدادها", file: "all_event_boundaries.bpmn" },
  { label: "انواع رویدادها (بالا)", file: "all_event_types_on_top.bpmn" },
  { label: "انواع دروازه‌ها", file: "all_gateway_types.bpmn" },
  { label: "انواع جریان پیام", file: "all_message_flow_types.bpmn" },
  { label: "انواع جریان توالی", file: "all_sequence_flow_types.bpmn" },
  { label: "آرتیفکت و دیتاریفرنس", file: "artifacts_and_data_reference.bpmn" },
  { label: "برچسب‌گذاری جریان‌ها", file: "label_sequence_flows.bpmn" },
  { label: "استخرها/لین‌ها", file: "pools.bpmn" },
  { label: "زیرفرآیندها", file: "subprocesses.bpmn" },
  { label: "زیرفرآیند/ایونت/تراکنش", file: "subprocesses_event_and_transaction.bpmn" },
];

type EditorActions = { trigger: (action: string, opts?: any) => void };
type Canvas = { zoom: (value: number | "fit-viewport") => void };

const AUTOSAVE_DEBOUNCE_MS = 1200;

export default function InlineBpmnEditor({ processId, defaultTemplate = "blank.bpmn" }: InlineBpmnEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const propsPanelRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<BpmnModeler | null>(null);

  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState(defaultTemplate);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const getService = useCallback(<T,>(name: string): T | undefined => {
    return modelerRef.current?.get(name as any) as T | undefined;
  }, []);

  // init once
  useEffect(() => {
    if (!containerRef.current) return;

    const modeler = new BpmnModeler({
      container: containerRef.current,
      keyboard: { bindTo: document },
      // ✅ Pass the module objects (no undefined)
      additionalModules: [PropertiesPanelModule, BpmnPropertiesProviderModule],
      propertiesPanel: {
        parent: propsPanelRef.current!,
      },
    });

    modelerRef.current = modeler;
    loadDiagram();

    return () => modeler.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load: API -> localStorage -> template
  const loadDiagram = useCallback(async () => {
    if (!modelerRef.current) return;
    setLoading(true);
    try {
      const api = await fetch(`/api/bpmn/${processId}`);
      if (api.ok) {
        const xml = await api.text();
        await modelerRef.current.importXML(xml);
      } else {
        const ls = localStorage.getItem(`bpmn-${processId}`);
        if (ls) {
          await modelerRef.current.importXML(ls);
        } else {
          const res = await fetch(`/bpmn-files/${template}`);
          const xml = await res.text();
          await modelerRef.current.importXML(xml);
        }
      }
    } catch (err) {
      console.error("Load BPMN failed:", err);
    } finally {
      getService<Canvas>("canvas")?.zoom("fit-viewport");
      setLoading(false);
    }
  }, [processId, template, getService]);

  // Save to API with LS fallback
  const saveToApi = useCallback(
    async (xml: string) => {
      try {
        setSaving("saving");
        const res = await fetch(`/api/bpmn/${processId}`, {
          method: "POST",
          headers: { "Content-Type": "application/xml" },
          body: xml,
        });
        if (!res.ok) throw new Error(`API ${res.status}`);
        setSaving("saved");
      } catch {
        setSaving("error");
        localStorage.setItem(`bpmn-${processId}`, xml);
        console.warn("Saved to localStorage fallback.");
      } finally {
        setTimeout(() => setSaving("idle"), 1200);
      }
    },
    [processId]
  );

  const handleSave = useCallback(async () => {
    if (!modelerRef.current) return;
    const { xml } = await modelerRef.current.saveXML({ format: true });
    await saveToApi(xml ?? "");
  }, [saveToApi]);

  // Autosave on changes (debounced)
  const debouncedAutoSave = useMemo(() => {
    let t: any;
    return async () => {
      if (!modelerRef.current) return;
      clearTimeout(t);
      t = setTimeout(async () => {
        try {
          const { xml } = await modelerRef.current!.saveXML({ format: true });
          await saveToApi(xml ?? "");
        } catch (e) {
          console.error("Autosave failed:", e);
        }
      }, AUTOSAVE_DEBOUNCE_MS);
    };
  }, [saveToApi]);

  useEffect(() => {
    const modeler = modelerRef.current;
    if (!modeler) return;
    const onChanged = () => debouncedAutoSave();
    modeler.on("commandStack.changed", onChanged);
    return () => modeler.off("commandStack.changed", onChanged);
  }, [debouncedAutoSave]);

  // Reset to last saved
  const resetToLastSaved = useCallback(async () => {
    await loadDiagram();
  }, [loadDiagram]);

  // Editor actions
  const doAction = useCallback(
    (action: string, opts?: any) => {
      const ea = getService<EditorActions>("editorActions");
      ea?.trigger(action, opts);
    },
    [getService]
  );

  const undo = () => doAction("undo");
  const redo = () => doAction("redo");
  const handTool = () => doAction("handTool");
  const lassoTool = () => doAction("lassoTool");
  const spaceTool = () => doAction("spaceTool");
  const globalConnect = () => doAction("globalConnectTool");
  const zoomIn = () => doAction("zoomIn");
  const zoomOut = () => doAction("zoomOut");
  const zoomFit = () => doAction("zoom", { value: "fit-viewport" });

  const alignLeft = () => doAction("alignElements", { type: "left" });
  const alignCenter = () => doAction("alignElements", { type: "center" });
  const alignRight = () => doAction("alignElements", { type: "right" });

  // Template overwrite
  const [selectedTemplate, setSelectedTemplate] = useState(template);
  const loadTemplateNow = useCallback(async () => {
    if (!modelerRef.current) return;
    const ok = confirm("طرح فعلی با الگوی انتخاب‌شده جایگزین می‌شود. ادامه می‌دهید؟");
    if (!ok) return;
    const res = await fetch(`/bpmn-files/${selectedTemplate}`);
    const xml = await res.text();
    await modelerRef.current.importXML(xml);
    getService<Canvas>("canvas")?.zoom("fit-viewport");
    setTemplate(selectedTemplate);
  }, [selectedTemplate, getService]);

  // Exporters
  const handleExportXML = async () => {
    if (!modelerRef.current) return;
    const { xml } = await modelerRef.current.saveXML({ format: true });
    const blob = new Blob([xml ?? ""], { type: "text/xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${processId}.bpmn`;
    a.click();
  };

  const handleExportPNG = async () => {
    if (!modelerRef.current) return;
    try {
      const { svg } = await modelerRef.current.saveSVG();
      if (!svg) throw new Error("SVG export failed");
      const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((b) => {
          if (!b) return;
          const a = document.createElement("a");
          a.href = URL.createObjectURL(b);
          a.download = `${processId}.png`;
          a.click();
        });
      };
      img.src = url;
    } catch (e) {
      console.error("PNG export failed:", e);
    }
  };

  return (
    <div className="w-full p-3 bg-white border border-gray-300 rounded-md space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {saving === "saving" && <span className="text-xs text-gray-500">در حال ذخیره…</span>}
        {saving === "saved" && <span className="text-xs text-green-600">ذخیره شد ✓</span>}
        {saving === "error" && (
          <span className="text-xs text-amber-600">ذخیره در سرور ناموفق، به صورت محلی ذخیره شد</span>
        )}
        <span className="sep" />
        <button onClick={handleSave} className="btn-blue">
          💾 ذخیره
        </button>
        <button onClick={handleExportXML} className="btn-gray">
          ⬇️ XML
        </button>
        <button onClick={handleExportPNG} className="btn-gray">
          🖼 PNG
        </button>
        <button onClick={resetToLastSaved} className="btn-gray">
          ↺ بازیابی آخرین ذخیره
        </button>
        <span className="sep" />
        <button onClick={undo} className="btn-gray">
          ↶ Undo
        </button>
        <button onClick={redo} className="btn-gray">
          ↷ Redo
        </button>
        <span className="sep" />
        <button onClick={handTool} className="btn-gray">
          ✋ Hand
        </button>
        <button onClick={lassoTool} className="btn-gray">
          🔲 Lasso
        </button>
        <button onClick={spaceTool} className="btn-gray">
          ↔ Space
        </button>
        <button onClick={globalConnect} className="btn-gray">
          🔗 Connect
        </button>
        <span className="sep" />
        <button onClick={alignLeft} className="btn-gray">
          ⟸ Align L
        </button>
        <button onClick={alignCenter} className="btn-gray">
          ⇔ Align C
        </button>
        <button onClick={alignRight} className="btn-gray">
          ⟹ Align R
        </button>
        <span className="sep" />
        <button onClick={zoomOut} className="btn-gray">
          🔍−
        </button>
        <button onClick={zoomIn} className="btn-gray">
          🔍+
        </button>
        <button onClick={zoomFit} className="btn-gray">
          🧭 Fit
        </button>
        <span className="sep" />
        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {TEMPLATES.map((t) => (
            <option key={t.file} value={t.file}>
              {t.label}
            </option>
          ))}
        </select>
        <button onClick={loadTemplateNow} className="btn-gray">
          📥 بارگذاری الگو
        </button>
      </div>

      {/* Canvas + Properties panel with grid background */}
      <div className="grid grid-cols-12 gap-3">
        <div
          ref={containerRef}
          className="relative col-span-12 md:col-span-9 h-[calc(100vh-140px)] border border-gray-200 rounded-md bg-white bpmn-grid"
        >
          {loading && <p className="text-center text-gray-400 mt-10">در حال بارگذاری...</p>}
        </div>
        <div
          ref={propsPanelRef}
          className="col-span-12 md:col-span-3 h-[calc(100vh-140px)] border border-gray-200 rounded-md overflow-auto"
        />
      </div>

      {/* Local styles */}
      <style jsx>{`
        .btn-blue {
          background: #2563eb;
          color: white;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 13px;
        }
        .btn-blue:hover {
          background: #1d4ed8;
        }
        .btn-gray {
          background: #f3f4f6;
          color: #111827;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 13px;
        }
        .btn-gray:hover {
          background: #e5e7eb;
        }
        .sep {
          width: 1px;
          height: 22px;
          background: #d1d5db;
          margin: 0 4px;
        }

        /* ✅ BPMN-like grid background (10px minor, 50px major) */
        .bpmn-grid,
        .bpmn-grid :global(.djs-container) {
          background-color: #ffffff;
          background-image: linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
            linear-gradient(to right, rgba(0, 0, 0, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.06) 1px, transparent 1px);
          background-size: 10px 10px, 10px 10px, 50px 50px, 50px 50px;
          background-position: 0 0, 0 0, 0 0, 0 0;
        }
      `}</style>
    </div>
  );
}
