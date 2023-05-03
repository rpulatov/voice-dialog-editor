import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import React from "react";
import { getDialogList } from "~/models/dialog.server";

export const loader = async ({ request }: LoaderArgs) => {
  return json(await getDialogList());
};

export default function DialogsPage() {
  const data = useLoaderData<typeof loader>();

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
            {data.map((item) => (
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
