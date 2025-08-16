import { useNode } from "@craftjs/core";
import { Box, FormControl, FormLabel, Slider } from "@mui/material";
import { blue, blueGrey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";

export const Text = ({
  text,
  fontSize,
}: {
  text: string;
  fontSize: number;
}) => {
  const {
    connectors: { connect, drag },
    hasSelectedNode,
    hasHoveredNode,
    actions: { setProp },
  } = useNode((state) => ({
    hasSelectedNode: state.events.selected,
    hasHoveredNode: state.events.hovered,
  }));

  const [editable, setEditable] = useState(false);

  useEffect(() => {
    !hasSelectedNode && setEditable(false);
  }, [hasSelectedNode]);
  return (
    <Box
      dir="rtl"
      component="div"
      //@ts-ignore
      ref={(ref) => connect(drag(ref))}
      onClick={() => setEditable(true)}
      sx={{
        border: hasHoveredNode ? `1px inset ${blue[300]}` : "none",
        borderRadius: 1,
      }}
    >
      <ContentEditable
        html={text}
        disabled={!editable}
        onChange={(e) =>
          setProp(
            (props: any) =>
              (props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, ""))
          )
        }
        tagName="p"
        style={{ fontSize: `${fontSize}px`, textAlign: "right" }}
      />
    </Box>
  );
};

const TextSettings = () => {
  const {
    actions: { setProp },
    fontSize,
  } = useNode((node) => ({
    fontSize: node.data.props.fontSize,
  }));

  return (
    <>
      <FormControl size="small" component="fieldset">
        <FormLabel component="legend">Font size</FormLabel>
        <Slider
          value={fontSize || 7}
          step={7}
          min={1}
          max={50}
          onChange={(_, value) => {
            setProp((props: any) => (props.fontSize = value));
          }}
        />
      </FormControl>
    </>
  );
};

Text.craft = {
  related: {
    settings: TextSettings,
  },
};
