import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";
import { getDialog } from "~/models/dialog.server";

import schema from "../forms/dialog.schema.json";
import uischema from "../forms/dialog.uischema.json";
import { Box, Paper } from "@mui/material";

export default function DialogNewItem() {
  return (
    <Box p={4}>
      <Paper>
        <Box p={2}>
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={{}}
            renderers={materialRenderers}
            cells={materialCells}
          />
        </Box>
      </Paper>
    </Box>
  );
}
