import type { StatePropsOfMasterItem } from "@jsonforms/core";
import { withJsonFormsMasterListItemProps } from "@jsonforms/react";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

const ListWithDetailMasterItem = ({
  index,
  childLabel,
  selected,
  handleSelect,
  removeItem,
  path,
}: StatePropsOfMasterItem) => {
  return (
    <ListItem button selected={selected} onClick={handleSelect(index)}>
      <ListItemAvatar>
        <Avatar aria-label="Index">{index}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={childLabel} />
      <ListItemSecondaryAction>
        <IconButton
          aria-label="Delete"
          onClick={removeItem(path, index)}
          size="large"
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default withJsonFormsMasterListItemProps(ListWithDetailMasterItem);
