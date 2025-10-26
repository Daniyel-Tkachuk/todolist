import "./App.css"
import { Main } from "@/app/Main"
import { Header } from "@/common/components/Header/Header"
import { useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { selectAppError, selectThemeMode } from "@/app/appSlice.ts"
import { ErrorSnackbar } from "@/common/components"


export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const error = useAppSelector(selectAppError)

  const theme = getTheme(themeMode)

  return (
    <ThemeProvider theme={theme}>
      <div className={"app"}>
        <CssBaseline />
        <Header />
        <Main />
        {error && <ErrorSnackbar/>}
      </div>
    </ThemeProvider>
  )
}
