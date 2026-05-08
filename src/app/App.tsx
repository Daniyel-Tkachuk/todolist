import './App.css'
import {ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {Header} from "@/common/components/Header/Header.tsx";
import {Main} from "@/app/Main.tsx";
import {selectThemeMode} from "@/app/app-selectors.ts";
import {useAppSelector} from "@/common/hooks";
import {getTheme} from "@/common/theme";


export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const theme = getTheme(themeMode)

  return (
      <ThemeProvider theme={theme}>
        <div className={'app'}>
          <CssBaseline />
          <Header/>
          <Main/>
        </div>
      </ThemeProvider>
  )
}
