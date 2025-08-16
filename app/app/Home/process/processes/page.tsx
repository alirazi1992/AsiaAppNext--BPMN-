"use client";

import { useState } from "react";
import MyCustomComponent from "@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui";
import ProcessesContainer from "./_components/ProcessesContainer";

const ProcessesPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div dir="rtl">
      <MyCustomComponent>
        <ProcessesContainer />
      </MyCustomComponent>
    </div>
  );
};

export default ProcessesPage;
