import { Box } from "@mui/material";
import React from "react";

interface Props {
  children?: React.ReactNode;
  index: number;
  value: number;
  className?: string;
}

const AcsTabPanel = (props: Props) => {
  const { children, value, index, className } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ACS-tabpanel-${index}`}
      aria-labelledby={`ACS-tab-${index}`}
      className={className}
    >
      {value === index && children}
    </div>
  );
};

export default AcsTabPanel;
