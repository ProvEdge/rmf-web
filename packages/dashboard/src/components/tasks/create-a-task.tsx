import React from 'react';
import { Grid, GridProps, Paper, styled, Typography } from '@mui/material';
import { TaskBuilder } from './task-builder';

const prefix = 'create-a-task';
const classes = {
  root: `${prefix}-root`,
  paper: `${prefix}-paper`,
};
const StyledGrid = styled((props: GridProps) => <Grid {...props} />)(({ theme }) => ({
  [`&.${classes.root}`]: {
    padding: `${theme.spacing(4)}`,
    maxWidth: 1600,
    height: '100vh',
  },
  [`& .${classes.paper}`]: {
    padding: theme.spacing(2),
  },
}));
/**
 * TODO - connect to fleet options, activity type, zone and type
 * Parent component to handle all new task states
 */
export function CreateATask() {
  return (
    <StyledGrid
      container
      wrap="nowrap"
      justifyContent="center"
      spacing={2}
      className={classes.root}
    >
      <Grid item xs={5}>
        <TaskBuilder />
      </Grid>
      <Grid item xs={7}>
        <Paper variant="outlined" className={classes.paper}>
          <Typography variant="h5">Task Details</Typography>
        </Paper>
      </Grid>
    </StyledGrid>
  );
}
