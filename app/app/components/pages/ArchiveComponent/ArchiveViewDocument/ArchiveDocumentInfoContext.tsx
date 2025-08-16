import { createContext, ReactNode, useContext, useState } from "react";

type ArchiveDocumentInfoContextType = {
  activeTabId: number;
  setActiveTabId: React.Dispatch<React.SetStateAction<number>>;
};

const ArchiveDocumentInfoContext = createContext<ArchiveDocumentInfoContextType | undefined>(undefined);

export const ArchiveDocumentInfoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTabId, setActiveTabId] = useState<number>(1); // set Default active tab to 1(default server response is 1)

  return (
    <ArchiveDocumentInfoContext.Provider value={{ activeTabId, setActiveTabId }}>
      {children}
    </ArchiveDocumentInfoContext.Provider>
  );
};

export const useArchiveDocumentInfo = (): ArchiveDocumentInfoContextType => {
  const context = useContext(ArchiveDocumentInfoContext);
  if (!context) {
    throw new Error("useTheme must be used within a ArchiveDocumentInfoProvider");
  }
  return context;
};
