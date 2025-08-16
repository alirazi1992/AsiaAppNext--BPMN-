import { Element, useNode } from "@craftjs/core";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  GridProps,
  Slider,
  Switch,
} from "@mui/material";
import { blue, blueGrey } from "@mui/material/colors";
import React from "react";
import { Button } from "./Button";

export const GridWrapper = ({ children }: { children: React.ReactNode }) => {
  const {
    connectors: { connect },
  } = useNode();
  return (
    //@ts-ignore
    <Grid container spacing={1} ref={connect}>
      {children}
    </Grid>
  );
};

export const GridContainer = ({
  spacing = 2,
  children,
}: {
  spacing?: number;
  children?: React.ReactNode;
}) => {
  const {
    connectors: { connect, drag },
    hasHoveredNode,
    hasSelectedNode,
  } = useNode((state) => ({
    hasHoveredNode: state.events.hovered,
    hasSelectedNode: state.events.selected,
  }));

  return (
    //@ts-ignore
    <Box
      dir="rtl"
      component="div"
      //@ts-ignore
      ref={(ref) => connect(drag(ref))}
      sx={{
        // background: hasHoveredNode ? "#eee" : blueGrey[200],
        // border: (t) =>
        //   hasSelectedNode ? `1px solid ${t.palette.primary.main}` : "none",
        // borderRadius: 1,
        minHeight: 50,
        ml: 0,
        mt: 2,
        border: hasHoveredNode ? `1px inset ${blue[300]}` : "none",
        borderRadius: 1,
      }}
    >
      <Element id="buttons" is={GridWrapper} canvas>
        <GridItem />
      </Element>
    </Box>
  );
};

GridContainer.craft = {
  displayName: "Grid Container",
  props: {
    spacing: 2,
  },
  rules: {
    canMoveIn: () => true,
  },
  related: {
    settings: () => null,
  },
};

export const GridItem = ({ md = 6 }: GridProps) => {
  const {
    connectors: { connect, drag },
    hasHoveredNode,
    actions: { setProp },
  } = useNode((state) => ({
    hasSelectedNode: state.events.selected,
    hasHoveredNode: state.events.hovered,
  }));

  return (
    //@ts-ignore
    <Grid
      item
      md={md}
      lg={md}
      xl={md}
      //@ts-ignore
      ref={(ref) => connect(drag(ref))}
      sx={{
        border: hasHoveredNode ? `1px inset ${blue[300]}` : "none",
        borderRadius: 1,
        // background: hasHoveredNode ? blueGrey[800] : "white",
        minHeight: 100,
        p: 1,
      }}
    >
      {/* <Container background="white" padding={1}> */}
      <Element id="text" is={"div"} canvas>
        <Button>default button</Button>
      </Element>
      {/* </Container> */}
    </Grid>
  );
};

const GridSettings = () => {
  const {
    actions: { setProp },
    size,
    item,
    container,
  } = useNode((node) => ({
    size: node.data.props.md,
    item: node.data.props.item,
    container: node.data.props.container,
  }));

  return (
    <>
      <FormControl size="small" component="fieldset">
        <FormLabel component="legend">Grid Size</FormLabel>
        <Slider
          value={size}
          step={1}
          min={1}
          max={12}
          onChange={(_, value) => {
            setProp((props: any) => (props.md = value));
          }}
          marks
          valueLabelDisplay="auto"
        />
      </FormControl>
      <FormControlLabel
        control={
          <Switch
            checked={item}
            onChange={(e) =>
              setProp((props: any) => (props.item = e.target.checked))
            }
          />
        }
        label="is item?"
      />
      <FormControlLabel
        control={
          <Switch
            checked={container}
            onChange={(e) =>
              setProp((props: any) => (props.container = e.target.checked))
            }
          />
        }
        label="is Container?"
      />
    </>
  );
};

GridItem.craft = {
  props: {
    md: 6,
  },
  related: {
    settings: GridSettings,
  },
};
