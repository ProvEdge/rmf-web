import react from 'react';
import {
  Autocomplete,
  Button,
  Grid,
  Paper,
  PaperProps,
  styled,
  Typography,
  TextField,
} from '@mui/material';

const prefix = 'phase-details';
const classes = {
  root: `${prefix}-root`,
};
const StyledPaper = styled((props: PaperProps) => <Paper {...props} />)(({ theme }) => ({
  [`&.${classes.root}`]: {
    padding: theme.spacing(2),
  },
}));

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

export function PhaseDetails() {
  return <StyledPaper variant="outlined" className={classes.root}></StyledPaper>;
}
