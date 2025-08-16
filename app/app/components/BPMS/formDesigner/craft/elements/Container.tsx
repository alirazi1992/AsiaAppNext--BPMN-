import { useNode } from "@craftjs/core";
import { Paper } from "@mui/material";
import React from "react";

export const Container = ({
  background,
  padding = 0,
  children,
}: {
  background: any;
  padding: number;
  children: React.ReactNode;
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    //@ts-ignore
    <Paper
      //@ts-ignore
      ref={(ref) => connect(drag(ref))}
      style={{ background, padding: `${padding}px` }}
    >
      {children}
    </Paper>
  );
};

export default Container;
