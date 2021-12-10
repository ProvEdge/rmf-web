import React from 'react';
import {
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  PaperProps,
  styled,
  Typography,
} from '@mui/material';

const prefix = 'phase-details';
const classes = {
  root: `${prefix}-root`,
};
const StyledPaper = styled((props: PaperProps) => <Paper {...props} />)(({ theme }) => ({
  [`&.${classes.root}`]: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
}));

// temp interface for a phase detail
interface PhaseDetail {
  id: number;
  category: string;
  detail: any;
  estimate_millis: number;
  final_event_id: number;
  events: any;
  skip_requests: any;
}

/**
 * structure of a phase
 *
 * {
 *  id - num
 *  category - string
 *  detail - { description: (object, array or string) }
 *  estimate_millis - int
 *  final_event_id - int
 *  events - {
 *    id:
 *    status - string
 *    name - string
 *    detail
 *    deps - array[int]
 *  }
 *  skip_requests - {
 *    unix_millis-request_time
 *    labels - []
 *    undo: {
 *    unix_millis-request_time
 *    labels - []
 *    }
 *
 *  }
 * }
 */

const parseItemAndQty = (item: { [key: string]: number }) => {
  let itemStr = '';
  Object.keys(item).forEach((k) => {
    itemStr += `${k} x ${item[k]},`;
  });
  return itemStr.slice(0, itemStr.length - 1);
};

export function PhaseDetails() {
  // mock phase array
  const phaseDetails: PhaseDetail[] = [
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
  ];
  // mock item and qty list --- how to get them from the phases?
  // item is associated with the id of the phase for now
  const itemAndQty: any = {
    0: { 'Coca Cola': 2, 'Green Spot': 1 },
    1: { 'Coca Cola': 2, 'Green Spot': 1 },
  };
  const itemAndQtyKeys = Object.keys(itemAndQty);
  return (
    <StyledPaper variant="outlined" className={classes.root}>
      <Typography variant="h5">Phase Details</Typography>
      <List>
        <Divider />
        {phaseDetails.map((detail) => {
          const getItemAndQty = itemAndQtyKeys.includes(detail.id.toString())
            ? parseItemAndQty(itemAndQty[detail.id.toString()])
            : null;
          return (
            <React.Fragment>
              <ListItem>
                <ListItemText primary={detail.detail} secondary={getItemAndQty} />
              </ListItem>
              <Divider />
            </React.Fragment>
          );
        })}
      </List>
      <Grid container justifyContent="flex-end">
        <Button variant="contained">Add to Task</Button>
      </Grid>
    </StyledPaper>
  );
}
