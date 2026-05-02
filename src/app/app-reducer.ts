import {createAction, createReducer} from "@reduxjs/toolkit";

type ThemeMode = 'dark' | 'light'

export const changeThemeModeAC = createAction<ThemeMode>('app/changeThemeMode')

const initialState = {
  themeMode: "light" as ThemeMode
}

export const appReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeThemeModeAC, (state, action) => {
      state.themeMode = action.payload
    })
})