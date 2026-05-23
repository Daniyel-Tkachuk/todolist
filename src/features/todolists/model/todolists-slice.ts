import {createSlice, nanoid} from "@reduxjs/toolkit"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as Todolist[],
  reducers: (create) => ({
    deleteTodolist: create.reducer<{id: string}>((state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }),
    createTodolist: create.preparedReducer(
      (title: string) => ({
        payload: {
          id: nanoid(),
          title,
        },
      }),
      (state, action) => {
        state.push({...action.payload, filter: "all"})
      },
    ),
    changeTodolistTitle: create.reducer<{id: string; title: string}>((state, action) => {
      const {id, title} = action.payload
      const index = state.findIndex((tl) => tl.id === id)
      if (index !== -1) {
        state[index].title = title
      }
    }),
    changeTodolistFilter: create.reducer<{id: string; filter: FilterValues}>((state, action) => {
      const {id, filter} = action.payload
      const index = state.findIndex((tl) => tl.id === id)
      if (index !== -1) {
        state[index].filter = filter
      }
    }),
  }),
  selectors: {
    selectTodolists: (state) => state,
  },
})

export const todolistsReducer = todolistsSlice.reducer
export const {deleteTodolist, createTodolist, changeTodolistFilter, changeTodolistTitle} = todolistsSlice.actions
export const {selectTodolists} = todolistsSlice.selectors

export type Todolist = {
  id: string
  title: string
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
