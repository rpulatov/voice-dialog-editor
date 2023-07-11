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

import type { Dialog } from "~/models/dialog.server";
import { saveDialog } from "~/models/dialog.server";
import isEqual from "lodash.isequal";
import {
  getDialog,
  transformToForm,
  transformToData,
  createNewDialog,
} from "~/models/dialog.server";

import schema from "../forms/dialog.schema.json";
import uischema from "../forms/dialog.uischema.json";
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
  const phrases = await getPhrases();

  return json({
    dialog: transformToForm(dialog),
    phrases: [
      {
        const: 0,
        title: "Отсутствует озвучиваемый текст",
      },
      ...phrases.map((phrase) => ({
        const: phrase.id,
        title: `${phrase.id} - ${phrase.content}`,
      })),
    ],
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

  const transformedData = transformToData(data);

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
  const { dialog: initialData, phrases } = useLoaderData<typeof loader>();
  const actionData = useActionData<{ errors: { [key: string]: string[] } }>();
  const submit = useSubmit();

  const [data, setData] = useState(initialData.dialog);
  const [isDraft, setIsDraft] = useState(false);

  const onChange = useCallback(
    (draftData: Dialog<string>) => {
      if (isEqual(draftData, initialData.dialog)) {
        setIsDraft(false);
      } else {
        setIsDraft(true);
        draftData.levels = draftData.levels.map((level, i) => ({
          ...level,
          levelNum: level.levelNum ?? i,
        }));
        draftData.levels.sort((a, b) => a.levelNum - b.levelNum);
        setData(draftData);
      }
    },
    [initialData]
  );

  const onSave = useCallback(
    (draftData: Dialog<string>) => {
      submit(
        {
          body: JSON.stringify({
            dialogId: initialData.dialogId,
            dialogName: draftData.dialogName,
            dialog: draftData,
          }),
        },
        { method: "POST" }
      );
    },
    [initialData.dialogId, submit]
  );

  useEffect(() => {
    setData(initialData.dialog);
  }, [initialData]);

  return (
    <Box p={4}>
      <Suspense fallback="">
        <LevelsDiagram data={data.levels} />
      </Suspense>
      <Paper>
        <Box p={2}>
          {actionData ? (
            <Stack sx={{ width: "100%", pb: 2 }} spacing={2}>
              {Object.keys(actionData.errors).map((key) => (
                <Alert severity="error" key={key}>
                  {key} - {actionData.errors[key].join(", ")}
                </Alert>
              ))}
            </Stack>
          ) : null}
          <JsonForms
            schema={{
              ...schema,
              definitions: {
                track: {
                  title: "Аудиотрек, который говорит робот",
                  type: "number",
                  oneOf: phrases,
                },
              },
            }}
            uischema={uischema}
            data={data}
            renderers={renderers}
            cells={materialCells}
            onChange={({ data, errors }) => onChange(data)}
          />
          <ButtonGroup>
            <Button
              variant="contained"
              disabled={!isDraft}
              onClick={() => onSave(data)}
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
