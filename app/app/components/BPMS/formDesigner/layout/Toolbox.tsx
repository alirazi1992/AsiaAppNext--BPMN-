import { Element, useEditor } from "@craftjs/core";
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import React from "react";
import TextInput from "../craft/elements/TextInput";
import { Text } from "../craft/elements/Text";
import Checkbox from "../craft/elements/Checkbox";
import { GridContainer, GridItem } from "../craft/elements/Grid";
import Container from "../craft/elements/Container";

import AddBoxIcon from "@mui/icons-material/AddBox";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import InputIcon from "@mui/icons-material/Input";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import { grey } from "@mui/material/colors";

export const Toolbox = () => {
  const { connectors, query } = useEditor();

  return (
    <Box
      px={1}
      dir="rtl"
      sx={{
        height: "100%",
        overflow: "auto",
        width: "50px",
        background: grey[300],
      }}
    >
      <button onClick={() => console.log(query.serialize())}>query</button>
      <Box my={2}>
        <Typography variant="body2" fontWeight={600} align="center">
          ابزارها
        </Typography>
      </Box>

      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <Tooltip title="دکمه">
            <div
              //@ts-ignore
              ref={(ref) =>
                connectors.create(
                  ref as HTMLElement,
                  <Button size="small">تایید</Button>
                )
              }
            >
              <IconButton>
                <AddBoxIcon />
              </IconButton>
            </div>
          </Tooltip>
        </Grid>

        <Grid item>
          <Tooltip title="متن">
            <div
              //@ts-ignore
              ref={(ref) =>
                connectors.create(
                  ref as HTMLElement,
                  <Text fontSize={18} text="Hi world" />
                )
              }
            >
              <IconButton>
                <TextFieldsIcon />
              </IconButton>
            </div>
          </Tooltip>
        </Grid>

        <Grid item>
          <Tooltip title="ورودی متن">
            <div
              //@ts-ignore
              ref={(ref) =>
                connectors.create(
                  ref as HTMLElement,
                  <TextInput label="برچسب" name="text-input" />
                )
              }
            >
              <IconButton>
                <InputIcon />
              </IconButton>
            </div>
          </Tooltip>
        </Grid>

        <Grid item>
          <Tooltip title="کانتینر">
            <div
              //@ts-ignore
              ref={
                (ref) =>
                  connectors.create(
                    ref as HTMLElement,
                    <Element
                      is={Container}
                      padding={20}
                      canvas
                      background={"#fefefe"}
                    >
                      <Text text="متن داخل کانتینر" fontSize={16} />
                    </Element>
                  )
                //@ts-ignore
              }
            >
              <IconButton>
                <CropSquareIcon />
              </IconButton>
            </div>
          </Tooltip>
        </Grid>

        <Grid item>
          <Tooltip title="چک‌باکس">
            <div
              //@ts-ignore
              ref={(ref) =>
                connectors.create(
                  ref as HTMLElement,
                  <Checkbox label="گزینه ای" />
                )
              }
            >
              <IconButton>
                <CheckBoxIcon />
              </IconButton>
            </div>
          </Tooltip>
        </Grid>

        <Grid item>
          <Tooltip title="گرید کانتینر">
            <div
              //@ts-ignore
              ref={(ref) =>
                connectors.create(ref as HTMLElement, <GridContainer />)
              }
            >
              <IconButton>
                <ViewComfyIcon />
              </IconButton>
            </div>
          </Tooltip>
        </Grid>

        <Grid item>
          <Tooltip title="آیتم گرید">
            <div
              //@ts-ignore
              ref={(ref) => connectors.create(ref as HTMLElement, <GridItem />)}
            >
              <IconButton>
                <ViewColumnIcon />
              </IconButton>
            </div>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
};
