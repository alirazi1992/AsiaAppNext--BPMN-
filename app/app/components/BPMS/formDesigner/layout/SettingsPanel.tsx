import { useEditor } from "@craftjs/core";
import { Box, Grid, Typography, Chip, Button } from "@mui/material";
import React from "react";

const SettingsPanel = () => {
  const { selected, actions } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected as any;
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings:
          state.nodes[currentNodeId].related &&
          state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
    }
    return {
      selected,
    };
  });

  return selected ? (
    <Box
      bgcolor="rgba(0, 0, 0, 0.06)"
      mt={2}
      px={2}
      py={2}
      sx={{ direction: "rtl" }}
    >
      <Grid container direction="column" spacing={0}>
        <Grid item>
          <Box pb={2}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography variant="subtitle1">Selected</Typography>
              </Grid>
              <Grid item>
                <Chip size="small" color="primary" label={selected.name} />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {selected.settings && React.createElement(selected.settings)}
        {selected.isDeletable ? (
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              actions.delete(selected.id);
            }}
          >
            Delete
          </Button>
        ) : null}
      </Grid>
    </Box>
  ) : null;
};

export default SettingsPanel;
