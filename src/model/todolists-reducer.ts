import type {FilterValues, Todolist} from '../app/App.tsx'
import {createAction, createReducer, nanoid} from "@reduxjs/toolkit";

export const deleteTodolistAC = createAction<{id: string}>('todolists/delete_todolist')
export const createTodolistAC = createAction('todolists/createTodolist', (title: string) => {
  return {payload: {title, id: nanoid()}}
})
export const changeTodolistTitleAC = createAction<{id: string, title: string}>('todolist/changeTodolistTitle')
export const changeTodolistFilterAC = createAction<{id: string, filter: FilterValues}>('todolists/changeTodolistFilter')


const initialState: Todolist[] = []

export const todolistsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(deleteTodolistAC, (state, action) => {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      if (index !== -1) state.splice(index, 1)
    })
    .addCase(createTodolistAC, (state, action) => {
      const newTodolist: Todolist = {...action.payload, filter: 'all'}
      state.push(newTodolist)
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

export type DeleteTodolistAction = ReturnType<typeof deleteTodolistAC>
export type CreateTodolistAction = ReturnType<typeof createTodolistAC>

