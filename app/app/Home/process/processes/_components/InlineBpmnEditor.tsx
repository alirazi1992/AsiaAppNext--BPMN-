"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Modeler from "bpmn-js/lib/Modeler";

// alignment module (native)
import AlignElementsModule from "diagram-js/lib/features/align-elements";

// core css
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

// properties panel (modern)
import "@bpmn-io/properties-panel/dist/assets/properties-panel.css";
import * as PropertiesPanelModule from "@bpmn-io/properties-panel";
import * as BpmnPropertiesProviderModule from "bpmn-js-properties-panel";

type CommandStack = { canUndo(): boolean; canRedo(): boolean };
type Canvas = {
  zoom: (value?: number | "fit-viewport", center?: { x: number; y: number }) => number | void;
};
type Selection = { get(): any[] };
type EditorActions = { trigger: (action: string, opts?: any) => void };

interface Props {
  processId: string;
  defaultTemplate?: string;
}

const PALETTE_POS_KEY = (pid: string) => `bpmn-${pid}-palette-pos`;

export default function InlineBpmnEditor({ processId, defaultTemplate = "blank.bpmn" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<Modeler | null>(null);

  const [loading, setLoading] = useState(true);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [selCount, setSelCount] = useState(0);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ---- FIX: safe generic getter in TSX (no <T> arrow)
  type Getter = <R = any>(name: string) => R | undefined;
  const get = useCallback<Getter>((name) => {
    return modelerRef.current?.get(name as any) as any;
  }, []);
  // -----------------------------------------------

  useEffect(() => {
    if (!containerRef.current || !propsRef.current) return;

    const modeler = new Modeler({
      container: containerRef.current,
      keyboard: { bindTo: document },
      propertiesPanel: { parent: propsRef.current },
      additionalModules: [PropertiesPanelModule as any, BpmnPropertiesProviderModule as any, AlignElementsModule],
    });

    modelerRef.current = modeler;

    (async () => {
      await loadDiagram(defaultTemplate);
      attachMovablePalette();
      wireState();
    })();

    return () => {
      try {
        modeler.destroy();
      } finally {
        modelerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDiagram = useCallback(
    async (templateFile: string) => {
      if (!modelerRef.current) return;
      setLoading(true);
      try {
        const r = await fetch(`/api/bpmn/${processId}`);
        if (r.ok) {
          await modelerRef.current.importXML(await r.text());
        } else {
          const ls = localStorage.getItem(`bpmn-${processId}`);
          if (ls) {
            await modelerRef.current.importXML(ls);
          } else {
            const t = await fetch(`/bpmn-files/${templateFile}`);
            await modelerRef.current.importXML(await t.text());
          }
        }
      } catch (e) {
        console.error("import failed", e);
      } finally {
        const canvas = get<Canvas>("canvas");
        canvas?.zoom("fit-viewport");
        setLoading(false);
      }
    },
    [get, processId]
  );

  const wireState = useCallback(() => {
    const cs = get<CommandStack>("commandStack");
    const selection = get<Selection>("selection");
    const m = modelerRef.current;
    if (!m || !cs || !selection) return;

    const updateCS = () => {
      setCanUndo(cs.canUndo());
      setCanRedo(cs.canRedo());
    };
    const updateSel = () => setSelCount(selection.get().length);

    m.on("commandStack.changed", updateCS);
    m.on("selection.changed", updateSel);
    updateCS();
    updateSel();
  }, [get]);

  const save = useCallback(async () => {
    if (!modelerRef.current) return;
    try {
      setSaving("saving");
      const { xml } = await modelerRef.current.saveXML({ format: true });
      const res = await fetch(`/api/bpmn/${processId}`, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xml ?? "",
      });
      if (!res.ok) throw new Error("api failed");
      setSaving("saved");
    } catch {
      setSaving("error");
      const { xml } = await modelerRef.current.saveXML({ format: true });
      localStorage.setItem(`bpmn-${processId}`, xml ?? "");
    } finally {
      setTimeout(() => setSaving("idle"), 1200);
    }
  }, [processId]);

  const exportPNG = async () => {
    if (!modelerRef.current) return;
    const { svg } = await modelerRef.current.saveSVG();
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      c.getContext("2d")!.drawImage(img, 0, 0);
      c.toBlob((b) => {
        if (!b) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.download = `${processId}.png`;
        a.click();
      });
    };
    img.src = url;
  };

  const zoom = (factor: number) => {
    const canvas = get<Canvas>("canvas");
    if (!canvas || !(modelerRef.current as any)) return;
    const current = (canvas.zoom() as number) || 1;
    const next = Math.max(0.2, Math.min(4, current * factor));

    const container = (modelerRef.current as any)._container as HTMLElement;
    const rect = container.getBoundingClientRect();
    const center = { x: rect.width / 2, y: rect.height / 2 };

    canvas.zoom(next, center);
  };
  const fit = () => get<Canvas>("canvas")?.zoom("fit-viewport");

  const tool = (name: "handTool" | "lassoTool" | "spaceTool" | "globalConnectTool") => {
    const ea = get<EditorActions>("editorActions");
    try {
      ea?.trigger(name);
      return;
    } catch {}
    const svc = get<any>(name);
    if (svc?.toggle) svc.toggle();
  };

  const getSelectedShapes = () => {
    const selection = get<Selection>("selection");
    if (!selection) return [] as any[];
    return selection.get().filter((e: any) => e && !e.waypoints && !e.labelTarget);
  };

  const align = (type: "left" | "center" | "right") => {
    const shapes = getSelectedShapes();
    if (shapes.length < 2) {
      console.log("[v0] Need at least 2 elements selected for alignment");
      return;
    }

    const ea = get<EditorActions>("editorActions");
    if (!ea) {
      console.log("[v0] EditorActions not available");
      return;
    }

    try {
      ea.trigger("alignElements", { type, elements: shapes });
    } catch (error) {
      console.error("[v0] Alignment failed:", error);
      const alignElements = get<any>("alignElements");
      if (alignElements?.trigger) {
        try {
          alignElements.trigger(shapes, type);
        } catch (fallbackError) {
          console.error("[v0] Fallback alignment also failed:", fallbackError);
        }
      }
    }
  };

  // ===== Movable Palette (drag + persist) =====
  const attachMovablePalette = () => {
    const host = containerRef.current;
    if (!host) return;

    if (getComputedStyle(host).position === "static") host.style.position = "relative";

    const palette = host.querySelector(".djs-palette") as HTMLDivElement | null;
    if (!palette) {
      requestAnimationFrame(attachMovablePalette);
      return;
    }

    palette.style.position = "absolute";
    palette.style.zIndex = "15";
    palette.style.right = "auto";

    const saved = localStorage.getItem(PALETTE_POS_KEY(processId));
    if (saved) {
      try {
        const { x, y } = JSON.parse(saved);
        palette.style.left = Number.isFinite(x) ? `${x}px` : "16px";
        palette.style.top = Number.isFinite(y) ? `${y}px` : "16px";
      } catch {
        palette.style.left = "16px";
        palette.style.top = "16px";
      }
    } else {
      palette.style.left = "16px";
      palette.style.top = "16px";
    }

    let handle = palette.querySelector(".bpmn-palette-drag-handle") as HTMLDivElement | null;
    if (!handle) {
      handle = document.createElement("div");
      handle.className = "bpmn-palette-drag-handle";
      handle.title = "Drag palette";
      handle.style.cssText = `
        height: 14px;
        background: rgba(0,0,0,0.06);
        border-bottom: 1px solid rgba(0,0,0,0.08);
        cursor: grab;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      `;
      palette.insertBefore(handle, palette.firstChild);
    }

    let dotsButton = palette.querySelector(".bpmn-palette-dots") as HTMLDivElement | null;
    if (!dotsButton) {
      dotsButton = document.createElement("div");
      dotsButton.className = "bpmn-palette-dots";
      dotsButton.innerHTML = "⋯";
      dotsButton.style.cssText = `
        padding: 8px;
        text-align: center;
        cursor: pointer;
        border-top: 1px solid #e5e7eb;
        font-size: 16px;
        color: #6b7280;
        background: #fff;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      `;
      dotsButton.addEventListener("click", (e) => {
        e.stopPropagation();
        setShowCreatePopup((prev) => !prev);
      });
      palette.appendChild(dotsButton);
    }

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    const begin = (e: PointerEvent) => {
      dragging = true;
      handle!.setPointerCapture(e.pointerId);
      const rect = palette!.getBoundingClientRect();
      const hostRect = host.getBoundingClientRect();
      startLeft = rect.left - hostRect.left;
      startTop = rect.top - hostRect.top;
      startX = e.clientX;
      startY = e.clientY;
      handle!.style.cursor = "grabbing";
      palette!.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
      palette!.style.transform = "scale(1.02)";
    };

    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const hostRect = host.getBoundingClientRect();
      const paletteRect = palette!.getBoundingClientRect();

      let newLeft = startLeft + dx;
      let newTop = startTop + dy;

      newLeft = Math.max(0, Math.min(newLeft, hostRect.width - paletteRect.width));
      newTop = Math.max(0, Math.min(newTop, hostRect.height - paletteRect.height));

      palette!.style.left = `${newLeft}px`;
      palette!.style.top = `${newTop}px`;
    };

    const end = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      handle!.releasePointerCapture(e.pointerId);
      handle!.style.cursor = "grab";
      palette!.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
      palette!.style.transform = "scale(1)";

      localStorage.setItem(
        PALETTE_POS_KEY(processId),
        JSON.stringify({
          x: Number.parseFloat(palette!.style.left || "0"),
          y: Number.parseFloat(palette!.style.top || "0"),
        })
      );
    };

    handle.addEventListener("pointerdown", begin);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);

    const cleanup = () => {
      handle?.removeEventListener("pointerdown", begin);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
    };

    const obs = new MutationObserver(() => {
      if (!host.contains(palette)) {
        cleanup();
        obs.disconnect();
      }
    });
    obs.observe(host, { childList: true, subtree: true });

    window.addEventListener("beforeunload", cleanup, { once: true });
  };

  const createElement = (elementType: string) => {
    const modeling = get<any>("modeling");
    const elementFactory = get<any>("elementFactory");
    const canvas = get<Canvas>("canvas");

    if (!modeling || !elementFactory || !canvas) return;

    try {
      const viewbox = (canvas as any).viewbox();
      const centerX = viewbox.x + viewbox.width / 2;
      const centerY = viewbox.y + viewbox.height / 2;

      const element = elementFactory.createShape({ type: elementType });
      modeling.createShape(
        element,
        { x: centerX, y: centerY },
        (modelerRef.current as any).get("canvas").getRootElement()
      );

      setShowCreatePopup(false);
      setSearchTerm("");
    } catch (error) {
      console.error("[v0] Failed to create element:", error);
    }
  };

  const elementCategories = [
    {
      name: "Gateways",
      items: [
        { name: "Exclusive gateway", type: "bpmn:ExclusiveGateway", icon: "◇" },
        { name: "Parallel gateway", type: "bpmn:ParallelGateway", icon: "⧫" },
        { name: "Event-based gateway", type: "bpmn:EventBasedGateway", icon: "◈" },
      ],
    },
    {
      name: "Tasks",
      items: [
        { name: "Task", type: "bpmn:Task", icon: "☐" },
        { name: "User task", type: "bpmn:UserTask", icon: "👤" },
        { name: "Service task", type: "bpmn:ServiceTask", icon: "⚙" },
        { name: "Business rule task", type: "bpmn:BusinessRuleTask", icon: "📋" },
      ],
    },
  ];

  const filteredCategories = elementCategories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <div className="bpmn-wrap">
      <div className="toolbar">
        <div className="left">
          <button className="btn primary" onClick={save}>
            💾 ذخیره
          </button>
          <button className="btn" onClick={exportPNG}>
            🖼 PNG
          </button>
          {saving !== "idle" && (
            <span className={`save ${saving}`}>
              {saving === "saving" ? "در حال ذخیره…" : saving === "saved" ? "ذخیره شد ✓" : "ذخیره محلی"}
            </span>
          )}
        </div>

        <div className="mid">
          <button
            className="btn"
            onClick={() => get<EditorActions>("editorActions")?.trigger("undo")}
            disabled={!canUndo}
          >
            ↶ Undo
          </button>
          <button
            className="btn"
            onClick={() => get<EditorActions>("editorActions")?.trigger("redo")}
            disabled={!canRedo}
          >
            ↷ Redo
          </button>

          <span className="bar" />

          <button className="btn" onClick={() => tool("handTool")}>
            ✋ Hand
          </button>
          <button className="btn" onClick={() => tool("lassoTool")}>
            🔲 Lasso
          </button>
          <button className="btn" onClick={() => tool("spaceTool")}>
            ↔ Space
          </button>
          <button className="btn" onClick={() => tool("globalConnectTool")}>
            🔗 Connect
          </button>

          <span className="bar" />

          <button
            className={`btn ${selCount >= 2 ? "active" : ""}`}
            onClick={() => align("left")}
            disabled={selCount < 2}
            title={selCount < 2 ? "Select 2 or more elements to align" : "Align selected elements to the left"}
          >
            ⬅ Align L
          </button>
          <button
            className={`btn ${selCount >= 2 ? "active" : ""}`}
            onClick={() => align("center")}
            disabled={selCount < 2}
            title={selCount < 2 ? "Select 2 or more elements to align" : "Align selected elements to center"}
          >
            ↔ Align C
          </button>
          <button
            className={`btn ${selCount >= 2 ? "active" : ""}`}
            onClick={() => align("right")}
            disabled={selCount < 2}
            title={selCount < 2 ? "Select 2 or more elements to align" : "Align selected elements to the right"}
          >
            ➡ Align R
          </button>

          <span className="bar" />

          <button className="btn" onClick={() => zoom(1 / 1.2)}>
            🔍−
          </button>
          <button className="btn" onClick={() => zoom(1.2)}>
            🔍+
          </button>
          <button className="btn" onClick={fit}>
            🧭 Fit
          </button>
        </div>

        <div className="right" />
      </div>

      <div className="main">
        <div ref={containerRef} className="canvas">
          {loading && <div className="loading">در حال بارگذاری…</div>}

          {showCreatePopup && (
            <div className="create-popup-overlay" onClick={() => setShowCreatePopup(false)}>
              <div className="create-popup" onClick={(e) => e.stopPropagation()}>
                <div className="create-popup-header">
                  <h3>Create element</h3>
                  <button className="close-btn" onClick={() => setShowCreatePopup(false)}>
                    ×
                  </button>
                </div>

                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>

                <div className="categories">
                  {filteredCategories.map((category) => (
                    <div key={category.name} className="category">
                      <h4 className="category-title">{category.name}</h4>
                      {category.items.map((item) => (
                        <div key={item.type} className="category-item" onClick={() => createElement(item.type)}>
                          <span className="item-icon">{item.icon}</span>
                          <span className="item-name">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={propsRef} className="props" style={{ display: "none" }} />
      </div>

      <style jsx>{`
        .bpmn-wrap {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .toolbar {
          position: sticky;
          top: 0;
          z-index: 5;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 10px;
          padding: 8px;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
        }
        .left,
        .mid,
        .right {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .bar {
          width: 1px;
          height: 20px;
          background: #e5e7eb;
          margin-inline: 6px;
        }
        .btn {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 13px;
          line-height: 1;
          color: #111827;
        }
        .btn:hover {
          background: #f3f4f6;
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed.;
        }
        .btn.primary {
          background: #2563eb;
          border-color: #1d4ed8;
          color: #fff;
        }
        .btn.active {
          background: #dbeafe;
          border-color: #3b82f6;
          color: #1d4ed8;
        }

        .save {
          font-size: 12px;
        }
        .save.saving {
          color: #6b7280;
        }
        .save.saved {
          color: #059669;
        }
        .save.error {
          color: #b45309;
        }

        .main {
          position: relative;
          height: calc(100vh - 140px);
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
          background: transparent;
        }

        .canvas {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .canvas :global(.djs-container) {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background-color: transparent;
          background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
            linear-gradient(0deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.06) 1px, transparent 1px),
            linear-gradient(0deg, rgba(0, 0, 0, 0.06) 1px, transparent 1px);
          background-size: 10px 10px, 10px 10px, 50px 50px, 50px 50px;
          background-position: 0 0;
        }

        .loading {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }

        .props {
          position: absolute;
          top: 0;
          right: 0;
          width: 360px;
          height: 100%;
          border-left: 1px solid #e5e7eb;
          background: #fafafa;
          overflow: auto;
          z-index: 10;
        }

        .create-popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .create-popup {
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          width: 320px;
          max-height: 500px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .create-popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .create-popup-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #6b7280;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          color: #111827;
        }

        .search-container {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .search-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
        }

        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .categories {
          flex: 1;
          overflow-y: auto;
          padding: 8px 0;
        }

        .category {
          margin-bottom: 16px.;
        }

        .category-title {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 8px 0;
          padding: 0 16px;
        }

        .category-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          cursor: pointer;
          transition: background-color 0.15s;
        }

        .category-item:hover {
          background: #f3f4f6;
        }

        .item-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
        }

        .item-name {
          font-size: 14px;
          color: #374151;
        }

        :global(.djs-palette) {
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #fff;
          user-select: none;
        }
      `}</style>
    </div>
  );
}
