// components/user/Text.js
import { Box } from "@mui/material";

import MyCustomComponent from "@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui";
import { Editor, Element, Frame } from "@craftjs/core";

import { useState } from "react";
import Sidebar from "../layout/Sidebar";
import { Toolbox } from "../layout/Toolbox";
import { Button } from "./elements/Button";
import Checkbox from "./elements/Checkbox";
import Container from "./elements/Container";
import { GridContainer, GridItem, GridWrapper } from "./elements/Grid";
import { Text } from "./elements/Text";
import TextInput from "./elements/TextInput";

export default function Demo() {
  const [openSidebar, setOpenSidebar] = useState(true);
  return (
    <div className="max-w-full h-screen">
      <MyCustomComponent>
        <Editor
          resolver={{
            Button,
            Text,
            Container,
            TextInput,
            GridItem,
            GridContainer,
            GridWrapper,
            Checkbox,
          }}
        >
          <Box component="div" sx={{ display: "flex", p: 0.2, height: "100%" }}>
            <Toolbox />

            <Box
              component="div"
              sx={{
                flex: 1,
                border: (t) => `1px solid ${t.palette.divider}`,
                p: 0.1,
              }}
            >
              <Frame>
                <Element
                  is={Container}
                  padding={5}
                  id="element1"
                  background="#eee"
                  canvas
                >
                  <Text fontSize={18} text="ساخت فرم جدید" />
                  {/* <Element is={Container} padding={2} background="#999" canvas>
                    <Text fontSize={30} text="It's me again!" />
                  </Element> */}
                </Element>
              </Frame>
            </Box>

            <Sidebar
              isOpen={openSidebar}
              onToggleMenu={() => setOpenSidebar((p) => !p)}
            />
          </Box>
        </Editor>
      </MyCustomComponent>
    </div>
  );
}
