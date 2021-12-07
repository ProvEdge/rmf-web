import React from 'react';
import {
  AppBarTab,
  HeaderBar,
  HeaderBarProps,
  LogoButton,
  NavigationBar,
  Tooltip,
  useAsync,
} from 'react-components';
import { IconButton, Menu, MenuItem, Toolbar, Typography, styled } from '@mui/material';

const prefix = 'tab-bar';
const classes = {
  appBar: `${prefix}-root`,
};

const StyledHeaderBar = styled((props: HeaderBarProps) => <HeaderBar {...props} />)(
  ({ theme }) => ({
    [`&.${classes.appBar}`]: {
      zIndex: theme.zIndex.drawer + 1,
    },
  }),
);

export function TabBar() {
  return (
    <StyledHeaderBar className={classes.appBar}>
      <NavigationBar>
        <AppBarTab label="Tasks" value="Tasks" aria-label="Tasks" />
        <AppBarTab label="Create A Task" value="createTask" aria-label="createTask" />
      </NavigationBar>
    </StyledHeaderBar>
  );
}
