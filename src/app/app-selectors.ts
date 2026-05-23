import {RootState} from "./store.ts"
import {ThemeMode} from "./app-slice.ts"

export const selectThemeMode = (state: RootState): ThemeMode => state.app.themeMode
