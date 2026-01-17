import {createAction, createReducer, nanoid} from "@reduxjs/toolkit";

export const deleteTodolistAC = createAction<{ id: string }>('todolists/deleteTodolist')
export const changeTodolistTitleAC = createAction<{ id: string, title: string }>('todolists/changeTodolistTitle')
export const changeTodolistFilterAC = createAction<{
  id: string,
  filter: FilterValues
}>('todolists/changeTodolistFilter')
export const createTodolistAC = createAction('todolists/createTodolist', (title: string) => ({
  payload: {
    id: nanoid(),
    title
  }
}))

export type Todolist = {
  id: string
  title: string
  filter: FilterValues
}

export type FilterValues = 'all' | 'active' | 'completed'

const initialState: Todolist[] = []

export const todolistsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(deleteTodolistAC, (state, action) => {
      const {id} = action.payload
      const index = state.findIndex(todo => todo.id === id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    })
    .addCase(changeTodolistTitleAC, (state, action) => {
      const {id, title} = action.payload
      const index = state.findIndex(todo => todo.id === id)
      if (index !== -1) {
        state[index].title = title
      }
    })
    .addCase(changeTodolistFilterAC, (state, action) => {
      const {id, filter} = action.payload
      const index = state.findIndex(todo => todo.id === id)
      if (index !== -1) {
        state[index].filter = filter
      }
    })
    .addCase(createTodolistAC, (state, action) => {
      const {id, title} = action.payload
      const newTodolist: Todolist = {id, title, filter: 'all'}
      state.push(newTodolist)
    })
})



