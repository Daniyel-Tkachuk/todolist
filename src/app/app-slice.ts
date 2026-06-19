import {createSlice} from "@reduxjs/toolkit"
import type {RequestStatus} from "@/common/types"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
    appStatus: "idle" as RequestStatus,
  },
  reducers: (create) => ({
    changeThemeMode: create.reducer<{themeMode: ThemeMode}>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    changeAppStatus: create.reducer<RequestStatus>((state, action) => {
      state.appStatus = action.payload
    }),
  }),
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectAppStatus: (state) => state.appStatus,
  },
})

export const appReducer = appSlice.reducer
export const {changeThemeMode, changeAppStatus} = appSlice.actions
export const {selectThemeMode, selectAppStatus} = appSlice.selectors

export type ThemeMode = "dark" | "light"
