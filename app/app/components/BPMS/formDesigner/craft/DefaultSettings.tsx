type Props = {
  setProps: (cb: any, throttleRate?: number) => void;
  values: {
    margin: string;
    padding: string;
    border: string;
    borderRadius: string;
  };
};

const DefaultSettings = (props: Props) => {
  return <div>DefaultSettings</div>;
};

export default DefaultSettings;

import { Box, Grid, IconButton, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";

interface SpacingControlProps {
  value?: string;
  onChange: (value: string) => void;
  label: string;
}

export const SpacingControl = ({
  value = "",
  onChange,
  label,
}: SpacingControlProps) => {
  const [linked, setLinked] = useState(true);
  const [values, setValues] = useState({
    top: "",
    right: "",
    bottom: "",
    left: "",
  });

  // Parse the input string into sides
  useEffect(() => {
    const parts = value.trim().split(" ");
    const [top, right = top, bottom = top, left = right] = parts;
    setValues({ top, right, bottom, left });
    setLinked(top === right && top === bottom && top === left);
  }, [value]);

  // Update parent
  const emitChange = (v: typeof values) => {
    const result = `${v.top} ${v.right} ${v.bottom} ${v.left}`.trim();
    onChange(result);
  };

  const handleLinkedChange = (val: string) => {
    const linkedVals = {
      top: val,
      right: val,
      bottom: val,
      left: val,
    };
    setValues(linkedVals);
    emitChange(linkedVals);
  };

  const handleIndividualChange = (side: keyof typeof values, val: string) => {
    const updated = { ...values, [side]: val };
    setValues(updated);
    emitChange(updated);
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography fontWeight="bold">{label}</Typography>
        <IconButton size="small" onClick={() => setLinked(!linked)}>
          {linked ? (
            <LinkIcon fontSize="small" />
          ) : (
            <LinkOffIcon fontSize="small" />
          )}
        </IconButton>
      </Box>

      <Grid container spacing={1}>
        {linked ? (
          <Grid item xs={12}>
            <TextField
              label="همه"
              fullWidth
              size="small"
              value={values.top}
              onChange={(e) => handleLinkedChange(e.target.value)}
            />
          </Grid>
        ) : (
          <>
            <Grid item xs={6}>
              <TextField
                label="بالا"
                fullWidth
                size="small"
                value={values.top}
                onChange={(e) => handleIndividualChange("top", e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="راست"
                fullWidth
                size="small"
                value={values.right}
                onChange={(e) =>
                  handleIndividualChange("right", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="پایین"
                fullWidth
                size="small"
                value={values.bottom}
                onChange={(e) =>
                  handleIndividualChange("bottom", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="چپ"
                fullWidth
                size="small"
                value={values.left}
                onChange={(e) => handleIndividualChange("left", e.target.value)}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};
