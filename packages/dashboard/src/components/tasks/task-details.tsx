import React from 'react';
import {
  Button,
  Grid,
  PaperProps,
  Paper,
  styled,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const prefix = 'task-details';
const classes = {
  root: `${prefix}-root`,
  clearButton: `${prefix}-clear-button`,
};
const StyledPaper = styled((props: PaperProps) => <Paper {...props} />)(({ theme }) => ({
  [`&.${classes.root}`]: {
    padding: theme.spacing(2),
  },
  [`& .${classes.clearButton}`]: {
    marginRight: theme.spacing(1),
  },
}));

export function TaskDetails() {
  const tasks = [
    [
      {
        id: 0,
        category: 'Pick Up',
        detail: 'Pick Up: Vending Machines',
        estimate_millis: 0,
        final_event_id: 0,
        events: {},
        skip_requests: {},
      },
      {
        id: 1,
        category: 'Drop Off',
        detail: 'Drop Off: Pharmacy',
        estimate_millis: 0,
        final_event_id: 0,
        events: {},
        skip_requests: {},
      },
      {
        id: 2,
        category: 'Clean',
        detail: 'Clean: Ward 2',
        estimate_millis: 0,
        final_event_id: 0,
        events: {},
        skip_requests: {},
      },
    ],
    [
      {
        id: 0,
        category: 'Pick Up',
        detail: 'Pick Up: Pharmacy',
        estimate_millis: 0,
        final_event_id: 0,
        events: {},
        skip_requests: {},
      },
      {
        id: 1,
        category: 'Drop Off',
        detail: 'Drop Off: Ward 1',
        estimate_millis: 0,
        final_event_id: 0,
        events: {},
        skip_requests: {},
      },
    ],
    [
      {
        id: 0,
        category: 'Pick Up',
        detail: 'Pick Up: Vending Machines',
        estimate_millis: 0,
        final_event_id: 0,
        events: {},
        skip_requests: {},
      },
      {
        id: 1,
        category: 'Drop Off',
        detail: 'Drop Off: Pharmacy',
        estimate_millis: 0,
        final_event_id: 0,
        events: {},
        skip_requests: {},
      },
      {
        id: 2,
        category: 'Clean',
        detail: 'Clean: Kitchen',
        estimate_millis: 0,
        final_event_id: 0,
        events: {},
        skip_requests: {},
      },
    ],
  ];
  return (
    <StyledPaper variant="outlined" className={classes.root}>
      <Typography variant="h5">Task Details</Typography>
      <Grid container>
        {tasks.map((task, i) => {
          if (i < tasks.length - 1) {
            return (
              <Grid item>
                <Grid container justifyContent="center" alignItems="center">
                  <Grid item xs={9}>
                    <List>
                      <Divider />
                      {task.map((t) => {
                        return (
                          <React.Fragment>
                            <ListItem>
                              <ListItemText primary={t.detail} />
                            </ListItem>
                            <Divider />
                          </React.Fragment>
                        );
                      })}
                    </List>
                  </Grid>
                  <Grid item xs={3}>
                    <ArrowRightAltIcon />
                  </Grid>
                </Grid>
              </Grid>
            );
          } else {
            return (
              <Grid item>
                <Grid container>
                  <Grid>
                    <List>
                      <Divider />
                      {task.map((t) => {
                        return (
                          <React.Fragment>
                            <ListItem>
                              <ListItemText primary={t.detail} />
                            </ListItem>
                            <Divider />
                          </React.Fragment>
                        );
                      })}
                    </List>
                  </Grid>
                </Grid>
              </Grid>
            );
          }
        })}
      </Grid>
      <Grid container justifyContent="flex-end">
        <Button className={classes.clearButton} variant="outlined" color="secondary">
          Clear
        </Button>
        <Button variant="contained">Submit</Button>
      </Grid>
    </StyledPaper>
  );
}
