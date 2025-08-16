"use client";

import { useParams, useRouter } from "next/navigation";
import InlineBpmnEditor from "app/Home/process/processes/_components/InlineBpmnEditor";

export default function DesignPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const processId = params?.id ?? "";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header bar */}
      <div className="w-full border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200">
            ← بازگشت
          </button>
          <h1 className="font-semibold text-sm">
            طراحی BPMN برای آی‌دی: <code>{processId}</code>
          </h1>
        </div>
      </div>

      {/* Full-height editor area */}
      <div className="flex-1">
        <InlineBpmnEditor processId={processId} defaultTemplate="blank.bpmn" />
      </div>
    </div>
  );
}
