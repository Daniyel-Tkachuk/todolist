import {createAction, createReducer} from "@reduxjs/toolkit";

export const changeThemeModAC = createAction<{ themeMode: ThemeMode }>('app/changeThemeMode')

const initialState = {
  themeMode: 'light' as ThemeMode,
}

export const appReducer = createReducer(initialState, builder => {
  builder
    .addCase(changeThemeModAC, (state, action) => {
      state.themeMode = action.payload.themeMode
    })
})

export type ThemeMode = 'dark' | 'light'