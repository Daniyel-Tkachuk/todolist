import type {FilterValues, Todolist} from '../app/App.tsx'
import {createAction, createReducer, nanoid} from "@reduxjs/toolkit";


// action creator
export const deleteTodolistAC = createAction<{ id: string }>('todolists/deleteTodolist')
export const changeTodolistTitleAC = createAction<{ id: string, title: string }>('todolists/changeTodolistTitle')
export const changeTodolistFilterAC = createAction<{
  id: string,
  filter: FilterValues
}>('todolists/changeTodolistFilter')
export const createTodolistAC = createAction('todolists/createTodolist', (title: string) => {
  return {payload: {id: nanoid(), title,}}
})


const initialState: Todolist[] = []

// reducer
export const todolistReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(deleteTodolistAC, (state, action) => {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      if (index !== -1) state.splice(index, 1)
    })
    .addCase(createTodolistAC, (state, action) => {
      const {id, title} = action.payload
      state.push({id, title: title, filter: "all"})
    })
    .addCase(changeTodolistTitleAC, (state, action) => {
      const {id, title} = action.payload
      const index = state.findIndex(tl => tl.id === id)
      if (index !== -1) state[index].title = title
    })
    .addCase(changeTodolistFilterAC, (state, action) => {
      const {id, filter} = action.payload
      const index = state.findIndex(tl => tl.id === id)
      if (index !== -1) state[index].filter = filter
    })
})

