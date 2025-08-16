import { Alert } from "@mui/material";
import React from "react";

type Props = {
  errors: string | string[];
};

const ShowErrors = ({ errors }: Props) => {
  const errorList = typeof errors === "string" ? [errors] : errors;

  if (!errorList || errorList.length === 0) return null;

  return (
    <Alert variant="standard" severity="error">
      {errorList.map((error, index) => (
        <div key={index} className="flex items-start gap-2">
          <p>{error}</p>
        </div>
      ))}
    </Alert>
  );
};

export default ShowErrors;
