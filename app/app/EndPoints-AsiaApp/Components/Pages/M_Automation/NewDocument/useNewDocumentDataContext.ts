import { use } from "react";
import { DataContext } from "./NewDocument-MainContainer";

export function useNewDocumentDataContext() {
  const context = use(DataContext);
  if (!context) {
    throw new Error("Data context should wrap in Data context provider");
  }
  return context;
}