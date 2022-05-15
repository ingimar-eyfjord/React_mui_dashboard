import React, { useCallback, useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { GlobalState } from "context/store";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}
function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}
function union(a, b) {
  return [...a, ...not(b, a)];
}
export default function TransferList({
  TasksOrProjects,
  Department,
  right,
  setRight,
  left,
  setLeft,
  selectedProject
}) {
  const [Store] = useContext(GlobalState);
  const [checked, setChecked] = React.useState([]);
  const [defaultVal, setDefaultVal] = useState([])
  const MapValues = useCallback(async () => {
    let LeftValues = [];
    let RightValues = [];
    let defaultva = [];
    for (const e of Store.EmplyUsers) {
      if (e.departmentId === Department) {
        if (e.active === true) {
          const items = {
            userUUID: e.uuid,
            text: `${e.firstName} ${e.lastName}`,
          };
          defaultva.push(items);
          for (const p of Store.Options.Project){
            if(p.Project === selectedProject){
              if(p.Assigned_to.includes(e.uuid)){
                RightValues.push(items)
              }else if(!p.Assigned_to.includes(e.uuid)){
                LeftValues.push(items);
              }
            }
        }
      }
    }
  }
    setDefaultVal(defaultva)
    setLeft(LeftValues);
    setRight(RightValues);

  }, [Store, Department, setRight, setLeft, selectedProject]);

  useEffect(() => {
    MapValues();
  }, [ MapValues, Department]);

  const leftChecked = intersection(checked, left.map(e=>{ return e.userUUID}));
  const rightChecked = intersection(checked, right.map(e=>{ return e.userUUID}));

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const numberOfChecked = (items) => {
    return intersection(checked, items).length;
  };

  const handleToggleAll = (items) => () => {
    let itemsChecked = [];
    for (const c of items) {
      itemsChecked.push(c.userUUID);
    }
    if (numberOfChecked(itemsChecked) === itemsChecked.length) {
      setChecked(not(checked, itemsChecked));
    } else {
      setChecked(union(checked, itemsChecked));
    }
  };
  const handleCheckedRight = () => {
    let concatVal = []
    for (const e of defaultVal){
      for (const t of leftChecked){
        if(e.userUUID === t){
          concatVal.push(e)
        }
      }
    }
    setRight(right.concat(concatVal));
    setLeft(not(left, concatVal));
    setChecked(not(checked, concatVal));
  };

  const handleCheckedLeft = () => {
    let concatVal = []
    for (const e of defaultVal){
      for (const t of rightChecked){
        if(e.userUUID === t){
          concatVal.push(e)
        }
      }
    }
    setLeft(left.concat(concatVal));
    setRight(not(right, concatVal));
    setChecked(not(checked, concatVal));
  };
  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(
                items.map((e) => {
                  return e.userUUID;
                })
              ) ===
                items.map((e) => {
                  return e.userUUID;
                }).length &&
              items.map((e) => {
                return e.userUUID;
              }).length !== 0
            }
            indeterminate={
              numberOfChecked(
                items.map((e) => {
                  return e.userUUID;
                })
              ) !==
                items.map((e) => {
                  return e.userUUID;
                }).length &&
              numberOfChecked(
                items.map((e) => {
                  return e.userUUID;
                })
              ) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(
          items.map((e) => {
            return e.userUUID;
          })
        )}/${
          items.map((e) => {
            return e.userUUID;
          }).length
        } selected`}
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 230,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component='div'
        role='list'
      >
        {items.map((value, index) => {
          const labelId = `transfer-list-all-item-${value}-label`;
          return (
            <ListItem
              key={value.userUUID}
              role='listitem'
              button
              onClick={handleToggle(value.userUUID)}
              id={index}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value.userUUID) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.text}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} justifyContent='center' alignItems='center'>
      <Grid item>{customList("Choices", left)}</Grid>
      <Grid item>
        <Grid container direction='column' alignItems='center'>
          <Button
            sx={{ my: 0.5 }}
            variant='outlined'
            size='small'
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label='move selected right'
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant='outlined'
            size='small'
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label='move selected left'
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList("Chosen", right)}</Grid>
    </Grid>
  );
}
