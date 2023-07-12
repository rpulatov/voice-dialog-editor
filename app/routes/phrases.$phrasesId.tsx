import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import invariant from "tiny-invariant";

import type { Phrase } from "~/models/phrases.server";
// import { saveDialog } from "~/models/phrases.server";
import isEqual from "lodash.isequal";
import {
  transformToForm,
} from "~/models/phrases.server";

import schema from "../forms/phrases.schema.json";
import uischema from "../forms/phrases.uischema.json";
import { Alert, Box, Button, ButtonGroup, Paper, Stack } from "@mui/material";
import {
  MaterialListWithDetailRenderer,
  materialListWithDetailTester,
} from "~/shared/components/additional";
import { ApiError } from "~/proxy.server";
import { createNewPhrase, getPhrases, getPhrase } from "~/models/phrases.server";
// import LevelsDiagram from "~/shared/components/LevelsDiagram";

let LevelsDiagram = lazy(() => import("~/shared/components/LevelsDiagram"));

const renderers = [
  ...materialRenderers,
  {
    tester: materialListWithDetailTester,
    renderer: MaterialListWithDetailRenderer,
  },
];

export const loader = async ({ params, request }: LoaderArgs) => {
  invariant(params.phrasesId, "phraseId not found");

  let phrase = null;
  if (params.phrasesId === "new") {
    phrase = createNewPhrase();
  } else {
    phrase = await getPhrase(params.phrasesId);
  }
  if (!phrase) {
    throw new Response("Not Found", { status: 404 });
  }
  // const phrases = await getPhrases();

  return json({

  });
};

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const rawBody = form.get("body");

  if (!rawBody) {
    throw json("Missing body", { status: 400 });
  }

  if (typeof rawBody !== "string") {
    throw json("Malformed JSON body: expected string body", { status: 400 });
  }
  let data;
  try {
    data = JSON.parse(rawBody);
  } catch { }

  if (!data)
    throw json("Malformed JSON body: could not parse", { status: 400 });

  // const transformedData = transformToData(data);

  try {
    const response = await saveDialog(transformedData);
    if (!response || !response.dialogId) return redirect(`/dialogs/1`);
    return redirect(`/dialogs/${response.dialogId}`);
  } catch (e) {
    console.info(e);
    if (e instanceof ApiError) {
      return json(
        { errors: e.errorResponse.errors },
        { status: e.errorResponse.status }
      );
    }

    return json("Error save dialog", { status: 400 });
  }
};

export default function DialogItem() {

  // const { phrases } = useLoaderData<typeof loader>();
  const [isDraft, setIsDraft] = useState(false);
  const [activePhrase, setActivePhrase] = useState(null);

  return (
    <Box p={4}>
      <Paper>
        <Box p={2}>
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={{
              id: "",
              file: "",
              content: ""
            }}
            // data={phrases}
            renderers={renderers}
            cells={materialCells}
          // onChange={({ data, errors }) => onChange(data)}
          />
          <ButtonGroup>
            <Button
              variant="contained"
              disabled={!isDraft}
              // onClick={() => onSave(data)}
              type="submit"
            >
              Сохранить
            </Button>
          </ButtonGroup>
        </Box>
      </Paper>
    </Box>
  );
}
