import React from 'react';
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
import AndroidIcon from '@mui/icons-material/Android';

const prefix = 'task-builder';
const classes = {
  root: `${prefix}-root`,
};
const StyledPaper = styled((props: PaperProps) => <Paper {...props} />)(({ theme }) => ({
  [`&.${classes.root}`]: {
    padding: theme.spacing(2),
  },
}));

export function TaskBuilder() {
  return (
    <StyledPaper variant="outlined" className={classes.root}>
      <Typography variant="h5">Task Builder</Typography>
      <Autocomplete
        id="Select Fleet"
        freeSolo
        options={['fleet A', 'fleet B']}
        autoHighlight
        renderInput={(params) => (
          <TextField {...params} select label="Select Fleet" margin="normal" />
        )}
      />
      <Typography variant="body1">Activity Selection and details</Typography>
      <Autocomplete
        id="Activity type"
        freeSolo
        options={['Clean', 'Drop Off', 'Pick Up']}
        autoHighlight
        renderInput={(params) => (
          <TextField {...params} select label="Activity Type" margin="normal" />
        )}
      />
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <AndroidIcon sx={{ width: '100%', height: '100%' }} />
        </Grid>
        <Grid item xs={8}>
          <Autocomplete
            id="Zone"
            freeSolo
            options={['Pharmacy', 'Ward 1', 'Ward 2', 'Kitchen']}
            autoHighlight
            renderInput={(params) => <TextField {...params} select label="Zone" margin="normal" />}
          />
          <Autocomplete
            id="Type"
            freeSolo
            options={['Vacumn', 'Mop']}
            autoHighlight
            renderInput={(params) => <TextField {...params} select label="Type" margin="normal" />}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent="flex-end">
        <Button variant="contained">Add to phase</Button>
      </Grid>
    </StyledPaper>
  );
}
