import type { ArrayLayoutProps, RankedTester } from "@jsonforms/core";
import {
  and,
  composePaths,
  computeLabel,
  createDefaultValue,
  findUISchema,
  isObjectArray,
  rankWith,
  uiTypeIs,
} from "@jsonforms/core";
import {
  JsonFormsDispatch,
  withJsonFormsArrayLayoutProps,
} from "@jsonforms/react";
import { Grid, Hidden, List, Typography } from "@mui/material";
import map from "lodash/map";
import range from "lodash/range";
import React, { useCallback, useMemo, useState } from "react";
import { ArrayLayoutToolbar } from "../layouts/ArrayToolbar";
import ListWithDetailMasterItem from "./ListWithDetailMasterItem";
import merge from "lodash/merge";

export const MaterialListWithDetailRenderer = ({
  uischemas,
  schema,
  uischema,
  path,
  errors,
  visible,
  label,
  required,
  removeItems,
  addItem,
  data,
  renderers,
  cells,
  config,
  rootSchema,
}: ArrayLayoutProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    undefined
  );
  const handleRemoveItem = useCallback(
    (p: string, value: any) => () => {
      removeItems && removeItems(p, [value])();
      if (selectedIndex === value) {
        setSelectedIndex(undefined);
      } else if (selectedIndex && selectedIndex > value) {
        setSelectedIndex(Number(selectedIndex) - 1);
      }
    },
    [removeItems, setSelectedIndex]
  );
  const handleListItemClick = useCallback(
    (index: number) => () => setSelectedIndex(index),
    [setSelectedIndex]
  );
  const handleCreateDefaultValue = useCallback(
    () => createDefaultValue(schema),
    [createDefaultValue]
  );
  const foundUISchema = useMemo(
    () =>
      findUISchema(
        uischemas!,
        schema,
        uischema.scope,
        path,
        undefined,
        uischema,
        rootSchema
      ),
    [uischemas, schema, uischema.scope, path, uischema, rootSchema]
  );
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  React.useEffect(() => {
    setSelectedIndex(undefined);
  }, [schema]);

  return (
    <Hidden xsUp={!visible}>
      <ArrayLayoutToolbar
        label={computeLabel(
          label,
          required!,
          appliedUiSchemaOptions.hideRequiredAsterisk
        )}
        errors={errors}
        path={path}
        addItem={addItem}
        createDefault={handleCreateDefaultValue}
      />
      <Grid container direction="row" spacing={2}>
        <Grid item xs={3}>
          <List>
            {data > 0 ? (
              map(range(data), (index) => (
                <ListWithDetailMasterItem
                  index={index}
                  path={path}
                  schema={schema}
                  handleSelect={handleListItemClick}
                  removeItem={handleRemoveItem}
                  selected={selectedIndex === index}
                  key={index}
                />
              ))
            ) : (
              <p>No data</p>
            )}
          </List>
        </Grid>
        <Grid item xs>
          {selectedIndex !== undefined ? (
            <JsonFormsDispatch
              renderers={renderers}
              cells={cells}
              visible={visible}
              schema={schema}
              uischema={foundUISchema}
              path={composePaths(path, `${selectedIndex}`)}
            />
          ) : (
            <Typography variant="h6">No Selection</Typography>
          )}
        </Grid>
      </Grid>
    </Hidden>
  );
};

export const materialListWithDetailTester: RankedTester = rankWith(
  4,
  and(uiTypeIs("ListWithDetail2"), isObjectArray)
);

export default withJsonFormsArrayLayoutProps(MaterialListWithDetailRenderer);
