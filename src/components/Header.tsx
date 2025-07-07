import * as React from 'react';
import AppBar from '@mui/material/AppBar';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {NavButton} from "./NavButton.ts";
import {Switch, useTheme} from "@mui/material";

type Props = {
  changeMode: () => void
}

export default function Header({changeMode}: Props) {
  const theme = useTheme()

  return (
    <AppBar position={"fixed"}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{mr: 2}}
        >
          <MenuIcon/>
        </IconButton>
        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
          News
        </Typography>
        <div>
          <NavButton>Sign in</NavButton>
          <NavButton>Sign up</NavButton>
          <NavButton background={theme.palette.primary.dark}>Faq</NavButton>
          <Switch color={'primary'} onChange={changeMode} />
        </div>
      </Toolbar>
    </AppBar>
  );
}
