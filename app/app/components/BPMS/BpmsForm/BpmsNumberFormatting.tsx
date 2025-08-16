import { IconButton, TextField } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";
import { BpmsFormItems } from "../Bpms-types";
import InfoIcon from "@mui/icons-material/Info";

type Props = {};

const BpmsNumberFormatting = (props: Props) => {
  const { register } = useFormContext<BpmsFormItems>();
  return (
    <div className="flex gap-1 items-center">
      <IconButton color="info">
        <InfoIcon />
      </IconButton>
      <TextField
        label="فرمت داده"
        size="small"
        fullWidth
        {...register("NumberingFmt")}
      />
    </div>
  );
};

export default BpmsNumberFormatting;
