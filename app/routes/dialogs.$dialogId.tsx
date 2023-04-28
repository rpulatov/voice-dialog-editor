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

export const loader = async ({ params, request }: LoaderArgs) => {
  invariant(params.dialogId, "dialogId not found");

  const dialog = await getDialog(params.dialogId);
  if (!dialog) {
    throw new Response("Not Found", { status: 404 });
  }
  return json(dialog);
};

export default function DialogItem() {
  const data = useLoaderData<typeof loader>();

  console.info(data.dialog);

  return (
    <Box p={4}>
      <Paper>
        <Box p={2}>
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={data.dialog}
            renderers={materialRenderers}
            cells={materialCells}
          />
        </Box>
      </Paper>
    </Box>
  );
}
