// components/user/Text.js
import { useNode } from "@craftjs/core";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextFieldProps,
} from "@mui/material";

const TextInput = ({
  label = "برچسب",
  name = "text-field",
  variant = "outlined",
}: TextFieldProps) => {
  const {
    connectors: { connect, drag },
  } = useNode((state) => {
    return {
      hasSelectedNode: state.events.selected,
      hasDraggedNode: state.events.dragged,
    };
  });

  //   useEffect(() => {
  //     !hasSelectedNode && setEditable(false);
  //   }, [hasSelectedNode]);

  return (
    <div
      //@ts-ignore
      ref={(ref) => connect(drag(ref))}
    >
      <TextField
        size="small"
        label={label}
        name={name}
        variant={variant}
        fullWidth
      />
    </div>
  );
};

const TextInputSettings = () => {
  const {
    actions: { setProp },
    label,
    name,
    variant,
  } = useNode((node) => ({
    label: node.data.props.label,
    name: node.data.props.name,
    variant: node.data.props.variant,
  }));

  return (
    <Box
      component="div"
      dir="rtl"
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1 }}
    >
      <TextField
        label={"عنوان"}
        value={label}
        onChange={(e) =>
          setProp((props: any) => (props.label = e.target.value))
        }
        fullWidth
        size="small"
      />
      <TextField
        label={"نام"}
        value={name}
        onChange={(e) => setProp((props: any) => (props.name = e.target.value))}
        fullWidth
        size="small"
      />
      <FormControl size="small" component="fieldset" fullWidth>
        <InputLabel id="text-field-variant-select">نوع</InputLabel>
        <Select
          size="small"
          labelId="text-field-variant-select"
          value={variant}
          label="Age"
          onChange={(e) =>
            setProp((props: any) => (props.variant = e.target.value))
          }
        >
          <MenuItem value={"standard"}>standard</MenuItem>
          <MenuItem value={"outlined"}>outlined</MenuItem>
          <MenuItem value={"filled"}>filled</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

TextInput.craft = {
  related: {
    settings: TextInputSettings,
  },
};

export default TextInput;
