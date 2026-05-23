import {createSlice} from "@reduxjs/toolkit"

const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
  },
  reducers: (create) => ({
    changeThemeMode: create.reducer<{themeMode: ThemeMode}>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
  }),
})

export const appReducer = appSlice.reducer
export const {changeThemeMode} = appSlice.actions

export type ThemeMode = "dark" | "light"
