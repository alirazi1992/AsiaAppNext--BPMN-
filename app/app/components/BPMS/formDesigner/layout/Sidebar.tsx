import React from "react";
import SettingsPanel from "./SettingsPanel";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Layers } from "@craftjs/layers";
import { blueGrey } from "@mui/material/colors";
type Props = {
  isOpen: boolean;
  onToggleMenu: () => void;
};

const Sidebar = ({ isOpen, onToggleMenu }: Props) => {
  return (
    <Box
      component="div"
      sx={{
        width: isOpen ? 300 : 60,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        transition: "width 0.3s ease",
        overflow: "auto",
        bgcolor: "background.paper",
        boxShadow: 3,
        background: blueGrey[200],
        p: 0.5,
      }}
    >
      <div className="w-full flex justify-start p-2">
        <IconButton onClick={onToggleMenu}>
          <MenuOpenIcon
            sx={{
              transition: "transform 0.3s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </IconButton>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-2">
          <SettingsPanel />
          <Divider />
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{ mt: 1, mb: 0.5 }}
            textAlign={"left"}
          >
            لایه ها
          </Typography>
          <Layers />
        </div>
      )}
    </Box>
  );
};

export default Sidebar;
