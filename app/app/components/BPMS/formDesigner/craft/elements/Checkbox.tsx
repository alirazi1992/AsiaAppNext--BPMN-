import { useNode } from "@craftjs/core";
import {
  Box,
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextFieldProps,
  Checkbox as MaterialCheckbox,
} from "@mui/material";

type Props = CheckboxProps & FormControlLabelProps;

const Checkbox = ({
  label = "برچسب",
  name = "checkbox-field",
  labelPlacement = "start",
}: Partial<Props>) => {
  const {
    connectors: { connect, drag },
  } = useNode((state) => {
    return {
      hasSelectedNode: state.events.selected,
      hasDraggedNode: state.events.dragged,
    };
  });

  return (
    <div
      //@ts-ignore
      ref={(ref) => connect(drag(ref))}
    >
      <FormControlLabel
        control={<MaterialCheckbox />}
        label={label}
        name={name}
        labelPlacement={labelPlacement}
      />
    </div>
  );
};

export default Checkbox;

// components/user/Text.js

const CheckboxSettings = () => {
  const {
    actions: { setProp },
    label,
    name,
    labelPlacement,
  } = useNode((node) => ({
    label: node.data.props.label,
    name: node.data.props.name,
    labelPlacement: node.data.props.labelPlacement,
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
        <InputLabel id="checkbox-label-placement-select">
          جایگاه عنوان
        </InputLabel>
        <Select
          size="small"
          labelId="checkbox-label-placement-select"
          value={labelPlacement}
          label="جایگاه عنوان"
          onChange={(e) =>
            setProp((props: any) => (props.labelPlacement = e.target.value))
          }
        >
          <MenuItem value={"start"}>start</MenuItem>
          <MenuItem value={"end"}>end</MenuItem>
          <MenuItem value={"top"}>top</MenuItem>
          <MenuItem value={"bottom"}>bottom</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

Checkbox.craft = {
  related: {
    settings: CheckboxSettings,
  },
};
