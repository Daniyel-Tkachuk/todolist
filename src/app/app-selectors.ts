import type { ThemeMode } from "./appSlice.ts"
import type { RootState } from "./store"

export const selectThemeMode = (state: RootState): ThemeMode => state.app.themeMode
