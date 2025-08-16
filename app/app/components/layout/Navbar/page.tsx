"use client";
import React, { useState } from "react";
import themeStore from "@/app/zustandData/theme.zustand";
import colorStore from "@/app/zustandData/color.zustand";
import useStore from "@/app/hooks/useStore";
import sizeStore from "@/app/zustandData/size.zustand";
import styles from "@/app/assets/styles/Navbar.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  Navbar,
  SpeedDial,
  IconButton,
  SpeedDialHandler,
  SpeedDialContent,
  SpeedDialAction,
  Typography,
} from "@material-tailwind/react";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import MenuIcon from "@mui/icons-material/Menu";

type Props = {
  toggleSidebar: () => void;
};

const NavbarComponent = ({ toggleSidebar }: Props) => {
  const color = useStore(colorStore, (state) => state);
  const themeMode = useStore(themeStore, (state) => state);
  const { toggleMenu } = sizeStore();
  const [windowState, setWindowState] = useState("bi bi-fullscreen");

  const HandleFullScreen = () => {
    if (typeof window !== "undefined") {
      if (window.document.fullscreenElement) {
        document.exitFullscreen();
        setWindowState("bi bi-fullscreen");
      } else {
        window.document.documentElement.requestFullscreen();
        setWindowState("bi bi-fullscreen-exit");
      }
    }
  };

  return (
    <section className="w-full h-[60px]">
      <Navbar
        shadow
        fullWidth
        className={`${
          !themeMode || themeMode?.stateMode ? "themeDark" : "themeLight"
        } py-2 h-full navbar lg:py-4 border-none `}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="relative flex items-center w-full justify-between text-blue-gray-900">
          <Typography
            as="span"
            className="mr-4 cursor-pointer hidden lg:block py-1.5 font-medium"
            onClick={toggleSidebar}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <i className={`bi bi-list ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}></i>
          </Typography>

          <div className="hidden lg:block">
            <ul className="mb-4 mt-2 flex  flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              <li
                onClick={(state: any) => themeMode?.changeMode()}
                className={`p-1 cursor-pointer font-normal ${
                  !themeMode || themeMode?.stateMode ? "lightText" : "darkText"
                }`}
              >
                {themeMode?.mode == "bi bi-sun" ? (
                  <WbSunnyOutlinedIcon
                    fontSize="small"
                    className={`flex items-center ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                  />
                ) : (
                  <DarkModeOutlinedIcon
                    fontSize="small"
                    className={`flex items-center ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                  />
                )}
              </li>
              <li onClick={HandleFullScreen} className="p-1 cursor-pointer font-normal">
                {windowState == "bi bi-fullscreen" ? (
                  <FullscreenOutlinedIcon
                    className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                  />
                ) : (
                  <FullscreenExitOutlinedIcon
                    className={`${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                  />
                )}
              </li>
              <li className="p-1 cursor-pointer font-normal w-[50px]">
                <input
                  style={{ width: "25px" }}
                  className={`${styles.colorStyle} ${
                    !themeMode || themeMode?.stateMode ? "themeDark" : "themeLight"
                  } rounded-md cursor-pointer`}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => color?.changeColor(e.target.value)}
                  value={color?.color ?? "#748aaf"}
                  type="color"
                ></input>
              </li>
            </ul>
          </div>
          <div className="absolute top-0 right-0 lg:hidden">
            <SpeedDial placement="left">
              <SpeedDialHandler className={!themeMode || themeMode?.stateMode ? "themeDark" : "themeLight"}>
                <IconButton
                  size="md"
                  className="rounded-full"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <KeyboardDoubleArrowDownIcon
                    fontSize="small"
                    className={`mx-1 p-1 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                  />
                </IconButton>
              </SpeedDialHandler>
              <SpeedDialContent
                className="flex-row"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <SpeedDialAction
                  className={!themeMode || themeMode?.stateMode ? "themeDark" : "themeLight"}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <input
                    style={{ background: "#063751" }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => color?.changeColor(e.target.value)}
                    className={`${styles.colorStyle} ${
                      !themeMode || themeMode?.stateMode ? "themeDark" : "themeLight"
                    } rounded-md h-5 w-5 `}
                    value={color?.color ?? "#748aaf"}
                    type="color"
                  ></input>
                </SpeedDialAction>
                <SpeedDialAction
                  className={!themeMode || themeMode?.stateMode ? "themeDark" : "themeLight"}
                  onClick={(state: any) => themeMode?.changeMode()}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {themeMode?.mode == "bi bi-sun" ? (
                    <WbSunnyOutlinedIcon
                      fontSize="small"
                      className={`h-5 w-5 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                    />
                  ) : (
                    <DarkModeOutlinedIcon
                      fontSize="small"
                      className={`h-5 w-5 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                    />
                  )}
                </SpeedDialAction>
                <SpeedDialAction
                  className={!themeMode || themeMode?.stateMode ? "themeDark" : "themeLight"}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <MenuIcon
                    fontSize="small"
                    onClick={toggleSidebar}
                    className={`h-5 w-5 ${!themeMode || themeMode?.stateMode ? "lightText" : "darkText"}`}
                  />
                </SpeedDialAction>
              </SpeedDialContent>
            </SpeedDial>
          </div>
        </div>
      </Navbar>
    </section>
  );
};
export default NavbarComponent;
