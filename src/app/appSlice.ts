import { createSlice } from "@reduxjs/toolkit"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
    status: 'idle' as RequestStatus,
    error: null as string | null,
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{themeMode: ThemeMode}>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    changeAppStatusAC: create.reducer<{status: RequestStatus}>((state, action) => {
      state.status = action.payload.status
    }),
    setAppErrorAC: create.reducer<{error: string | null}>((state, action) => {
      state.error = action.payload.error
    })
  }),
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectAppStatus: (state) => state.status,
    selectAppError: (state) => state.error,
  }
})

export const {changeThemeModeAC, changeAppStatusAC, setAppErrorAC} = appSlice.actions
export const {selectThemeMode, selectAppStatus, selectAppError} = appSlice.selectors
export const appReducer = appSlice.reducer


export type ThemeMode = "dark" | "light"
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'