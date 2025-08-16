"use client";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

type Props = {
  base64: string;
};

function AcsPdfViewer({ base64 }: Props) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const fileUrl =
    base64.startsWith("data:") || base64.startsWith("blob:") ? base64 : "data:application/pdf;base64," + base64;
  return (
    <Worker workerUrl="/js/pdf.worker.js">
      <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
    </Worker>
  );
}

export default AcsPdfViewer;
