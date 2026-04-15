import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { NavButton } from "@/components/NavButton.ts"
import { Switch, useTheme } from "@mui/material"

type Props = {
  changeThemeMode: () => void
}

export const Header = ({changeThemeMode}: Props) => {
  const theme = useTheme()

  return (
    <Box sx={{ flexGrow: 1, marginBottom: "100px" }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <div>
            <NavButton>Sign in</NavButton>
            <NavButton>Sign up</NavButton>
            <NavButton background={theme.palette.primary.dark}>Faq</NavButton>
            <Switch color={'default'} onChange={changeThemeMode} />
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
