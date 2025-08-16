// components/user/Text.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button as MaterialButton,
  FormControl,
  FormLabel,
  Slider,
  Chip,
  FormControlLabel,
  Switch,
  TextField,
  TextFieldProps,
  ButtonProps,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useEditor, useNode } from "@craftjs/core";
import { SpacingControl } from "../DefaultSettings";
import { BorderRight } from "@mui/icons-material";

// components/user/Button.js

export const Button = ({ size, variant, color, children, sx }: ButtonProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    //@ts-ignore
    <MaterialButton
      //@ts-ignore
      ref={(ref) => connect(drag(ref))}
      size={size}
      variant={variant}
      color={color}
      sx={{
        padding: "2px 2px 2px 2px",
        margin: "2px 2px 2px 2px",
        borderRadius: "2px 2px 2px 2px",
      }}
    >
      {children}
    </MaterialButton>
  );
};

const ButtonSettings = () => {
  const {
    actions: { setProp },
    variant,
    margin,
    padding,
    borderRadius,
    props,
  } = useNode((node) => ({
    variant: node.data.props.variant,
    margin: node.data.props?.sx?.margin as string,
    padding: node.data.props?.sx?.padding as string,
    borderRadius: node.data.props?.sx?.borderRadius as string,
    props: node.data.props,
  }));

  console.log({ props });

  return (
    <Box
      component="div"
      dir="rtl"
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1 }}
    >
      <FormControl size="small" component="fieldset" fullWidth>
        <InputLabel id="button-variant-select">نوع</InputLabel>
        <Select
          labelId="button-variant-select"
          value={variant}
          label="Age"
          onChange={(e) =>
            setProp((props: any) => (props.variant = e.target.value))
          }
        >
          <MenuItem value={"contained"}>contained</MenuItem>
          <MenuItem value={"outlined"}>outlined</MenuItem>
          <MenuItem value={"text"}>text</MenuItem>
        </Select>
      </FormControl>

      <SpacingControl
        label="Margin"
        // type="margin"
        value={margin}
        onChange={(newValues) =>
          setProp((props: any) => (props.margin = newValues))
        }
      />
      <SpacingControl
        label="Padding"
        // type="padding"
        value={padding}
        onChange={(newValues) =>
          setProp((props: any) => (props.padding = newValues))
        }
      />
      <SpacingControl
        label="Border Radius"
        // type="borderRadius"
        value={borderRadius}
        onChange={(newValues) =>
          setProp((props: any) => (props.borderRadius = newValues))
        }
      />
    </Box>
  );
};

Button.craft = {
  related: {
    settings: ButtonSettings,
  },
  props: {
    sx: {
      margin: "2px 2px 2px 2px",
      padding: "2px 2px 2px 2px",
      borderRadius: "2px 2px 2px 2px",
    },
  },
};
