import {
  AppBar,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { LoaderFunction, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import React from "react";
import { getDialogList } from "~/models/dialog.server";

const isAuthorized = (request: Request) => {
  const header = request.headers.get("Authorization");

  if (!header) return false;

  const base64 = header.replace("Basic ", "");
  const [username, password] = Buffer.from(base64, "base64")
    .toString()
    .split(":");

  console.info({ username, password });
  return username === "test" && password === "test";
};

export const loader: LoaderFunction = async ({ request }) => {
  if (!isAuthorized(request)) {
    return json({ authorized: false, dialogs: [] }, { status: 401 });
  }

  const dialogs = await getDialogList();

  return json({ authorized: true, dialogs });
};

export const headers = () => ({
  "WWW-Authenticate": "Basic",
});

export default function DialogsPage() {
  const data = useLoaderData<typeof loader>();

  if (data.authorized === false) return null;

  return (
    <Grid
      container
      direction="column"
      minHeight="100vh"
      component="div"
      bgcolor="#e6e6e6"
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Настройка диалогов
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container component="main" flex={1}>
        <Grid item width={200} minHeight="100%" bgcolor="#fff">
          <List>
            <ListItemButton component={Link} to="new">
              <ListItemText primary="+ Создать новый" />
            </ListItemButton>
            {data.dialogs.map((item) => (
              <React.Fragment key={item.dialogId}>
                <Divider variant="middle" component="li" />
                <ListItemButton component={Link} to={item.dialogId}>
                  <ListItemText primary={`📝  ${item.dialogName}`} />
                </ListItemButton>
              </React.Fragment>
            ))}
          </List>
        </Grid>
        <Grid item flex={1}>
          <Outlet />
        </Grid>
      </Grid>
    </Grid>
  );
}
