import React from "react";
import type { LabelProps, RankedTester } from "@jsonforms/core";
import { rankWith, uiTypeIs } from "@jsonforms/core";
import { withJsonFormsLabelProps } from "@jsonforms/react";
import { Hidden, Typography } from "@mui/material";

/**
 * Default tester for a label.
 * @type {RankedTester}
 */
export const materialLabelRendererTester: RankedTester = rankWith(
  1,
  uiTypeIs("Label")
);

/**
 * Default renderer for a label.
 */
export const MaterialLabelRenderer = ({ text, visible }: LabelProps) => {
  return (
    <Hidden xsUp={!visible}>
      <Typography variant="h6">{text}</Typography>
    </Hidden>
  );
};

export default withJsonFormsLabelProps(MaterialLabelRenderer);
