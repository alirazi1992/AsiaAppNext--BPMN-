import React, { ReactNode } from "react";
import { createTheme, ThemeProvider, Theme, useTheme } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useStore } from "zustand";
import { themeStore } from "@/app/zustandData";

interface MyCustomComponentProps {
  children: ReactNode;
  dir?: string;
  color?: string;
}

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const MyCustomComponent: React.FC<MyCustomComponentProps> = ({ dir, children, color }) => {
  const themeMode = useStore(themeStore, (state) => state);
  const isDarkTheme = themeMode?.stateMode;

  const outerTheme = useTheme();
  const customTheme = (outerTheme: Theme) =>
    createTheme({
      direction: dir == "ltr" ? "ltr" : "rtl",
      palette: {
        // mode: outerTheme.palette.mode,
        mode: isDarkTheme ? "dark" : "light",
        secondary: {
          main: "#607d8b",
        },
        background: {
          default: isDarkTheme ? "#1a2531" : "#d9d6d2", // page background
          paper: isDarkTheme ? "#212e3a" : "#e5ded8", // card, modal, etc.
        },
      },

      typography: {
        fontFamily: "FaLight",
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: `
                      @font-face {
                        font-family: FaLight;
                        src: url('./assets/newFont/font/IranSansX\(Pro\)/FarsiFont/IRANSansXFaNum-Light.ttf') format('truetype'),
                      }
                    `,
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              "--TextField-brandBorderColor": color ?? "#78909c",
              "--TextField-brandBorderHoverColor": color ?? "#78909c",
              "--TextField-brandBorderFocusedColor": color ?? "#78909c",
              "& label.Mui-focused": {
                color: "var(--TextField-brandBorderFocusedColor)",
              },
              "& label": {
                color: "var(--TextField-brandBorderFocusedColor)",
              },
              [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderHoverColor)",
              },
              [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderFocusedColor)",
              },
              [`&.Mui-disabled .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderFocusedColor)",
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            notchedOutline: {
              borderColor: "var(--TextField-brandBorderColor)",
            },
            root: {
              "--TextField-brandBorderColor": color ?? "#78909c",
              "--TextField-brandBorderHoverColor": color ?? "#78909c",
              "--TextField-brandBorderFocusedColor": color ?? "#78909c",
              "& label.Mui-focused": {
                color: "var(--TextField-brandBorderFocusedColor)",
              },
              "& label": {
                color: "var(--TextField-brandBorderFocusedColor)",
              },
              [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderHoverColor)",
                borderWidth: "1px",
              },
              [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderFocusedColor)",
                borderWidth: "1px",
              },
              [`&.Mui-disabled .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderFocusedColor)",
                borderWidth: "1px",
              },
            },
          },
        },
        MuiInputLabel: {
          styleOverrides: {
            root: {
              fontSize: "16px",
            },
          },
        },
        MuiInput: {
          styleOverrides: {
            root: {
              "--TextField-brandBorderColor": color ?? "#607d8b",
              "--TextField-brandBorderHoverColor": color ?? "#607d8b",
              "--TextField-brandBorderFocusedColor": color ?? "#607d8b",
              "&::before": {
                borderBottom: "2px solid var(--TextField-brandBorderColor)",
              },
              "&:hover:not(.Mui-disabled, .Mui-error):before": {
                borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
              },
              "&.Mui-focused:after": {
                borderBottom: "2px solid var(--TextField-brandBorderFocusedColor)",
              },
              "&.Mui-disabled:after": {
                borderBottom: "2px solid var(--TextField-brandBorderFocusedColor)",
              },
            },
          },
        },
      },
    });

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={customTheme(outerTheme)}>{children}</ThemeProvider>
    </CacheProvider>
  );
};

export default MyCustomComponent;
