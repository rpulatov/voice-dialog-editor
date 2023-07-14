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
import UploadFileIcon from "@mui/icons-material/UploadFile";

import type { Phrase } from "~/models/phrases.server";
// import { saveDialog } from "~/models/phrases.server";
import isEqual from "lodash.isequal";
// import {
//   transformToForm,
// } from "~/models/phrases.server";

import schema from "../forms/phrases.schema.json";
import uischema from "../forms/phrases.uischema.json";
import { Alert, Box, Button, ButtonGroup, Checkbox, FormControl, FormControlLabel, FormHelperText, Grid, Input, InputBase, InputLabel, Paper, Select, Stack, TextField } from "@mui/material";
import {
  MaterialListWithDetailRenderer,
  materialListWithDetailTester,
} from "~/shared/components/additional";
import { ApiError } from "~/proxy.server";
import { createNewPhrase, getPhrases, getPhrase } from "~/models/phrases.server";
// import LevelsDiagram from "~/shared/components/LevelsDiagram";

let LevelsDiagram = lazy(() => import("~/shared/components/LevelsDiagram"));
import { type } from './../models/dialog.server';

const renderers = [
  ...materialRenderers,
  {
    tester: materialListWithDetailTester,
    renderer: MaterialListWithDetailRenderer,
  },
];

export const loader = async ({ params, request }: LoaderArgs) => {
  invariant(params.phraseId, "phraseId not found");

  let phrase = null;

  if (params.phraseId === "new") {
    phrase = createNewPhrase();
  } else {
    phrase = await getPhrase(Number(params.phraseId));
  }

  if (!phrase) {
    throw new Response("Not Found", { status: 404 });
  }

  return json(phrase);
};



export default function DialogItem() {
  const [isDraft, setIsDraft] = useState(false);
  const [activePhrase, setActivePhrase] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const data = useLoaderData<typeof loader>();
  const submit = useSubmit();
  console.log(data);

  const onSave = useCallback(
    (draftData: Phrase) => {
      submit(
        {
          body: JSON.stringify({
            id: data.id,
            file: data.file,
            content: data.content,
          }),
        },
        {
          method: "POST",
          action: `${data.id}`
        }
      );
    },
    [data.content, data.file, data.id, submit]
  );
  // const onChange = useCallback(
  //   (draftData: Phrase) => {
  //     if (isEqual(draftData, data.)) {
  //       setIsDraft(false);
  //     } else {
  //       setIsDraft(true);
  //       draftData.levels = draftData.levels.map((level, i) => ({
  //         ...level,
  //         levelNum: level.levelNum ?? i,
  //       }));
  //       draftData.levels.sort((a, b) => a.levelNum - b.levelNum);
  //       setData(draftData);
  //     }
  //   },
  //   [initialData]
  // );

  return (
    <>
      <Box sx={{ padding: 5 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={2}>
            <InputLabel
              sx={{
                display: "flex",
                justifyContent: "center",
                fontWeight: 700
              }}
            >
              Phrase id
            </InputLabel>
          </Grid>
          <Grid item xs={12} sm={10}>
            <TextField
              disabled
              id="id"
              name="id"
              // label="Will be generated on server"
              value={data.id}
              fullWidth
              size="small"
              autoComplete="off"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <InputLabel
              sx={{
                display: "flex",
                justifyContent: "center",
                fontWeight: 700
              }}
            >
              File
            </InputLabel>
          </Grid>
          <Grid item xs={12} sm={10}>
            <TextField
              disabled
              id="file"
              name="file"
              // label="Upload file"
              value={data.file}
              fullWidth
              size="small"
              autoComplete="off"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <InputLabel
              sx={{
                display: "flex",
                justifyContent: "center",
                fontWeight: 700
              }}
            >
              Content
            </InputLabel>
          </Grid>
          <Grid item xs={12} sm={10}>
            <TextField
              required
              id="content"
              name="content"
              // label="Add content"
              value={data.content}
              fullWidth
              size="small"
              autoComplete="off"
              variant="outlined"
            />
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2}>
              <InputLabel
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                File Upload
              </InputLabel>
              <InputBase
                type="file"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={3}>
          </Grid>
          <Grid item xs={12} sm={6} />
          <Grid item xs={12} sm={5} />
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained" sx={{ color: "#ff781f" }}
              onClick={() => {
                console.log(data);
              }}
              type="submit"
            >
              Submit
            </Button>
          </Grid>
        </Grid >
      </Box >
      {/* <Box p={4}>
        <Paper>
          <Box p={2}>
            <JsonForms
              schema={schema}
              uischema={uischema}
              data={data}
              renderers={renderers}
              cells={materialCells}
            // onChange={({ data, errors }) => onChange(data)}
            />
            <ButtonGroup>
              <Button
                variant="contained"
                // disabled={!isDraft}
                // onClick={() => onSave(data)}

                // onClick={() => onSave(data)}
                type="submit"
              >
                Сохранить
              </Button>
            </ButtonGroup>
          </Box>
        </Paper>
      </Box> */}
    </>
  );
}
