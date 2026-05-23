import {ThemeMode} from "@/app/app-slice.ts"
import {createTheme} from "@mui/material"

export const getTheme = (themeMode: ThemeMode) =>
  createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: "#087EA4",
      },
    },
  })
