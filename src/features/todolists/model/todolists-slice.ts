import {createSlice, nanoid} from "@reduxjs/toolkit"

const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as Todolist[],
  reducers: (create) => ({
    deleteTodolistAC: create.reducer<{id: string}>((state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }),
    changeTodolistTitleAC: create.reducer<{id: string; title: string}>((state, action) => {
      const {id, title} = action.payload
      const index = state.findIndex((tl) => tl.id === id)
      if (index !== -1) {
        state[index].title = title
      }
    }),
    changeTodolistFilterAC: create.reducer<{id: string; filter: FilterValues}>((state, action) => {
      const {id, filter} = action.payload
      const index = state.findIndex((tl) => tl.id === id)
      if (index !== -1) {
        state[index].filter = filter
      }
    }),
    createTodolistAC: create.preparedReducer(
      (title: string) => {
        const newTodolist: Todolist = {
          id: nanoid(),
          title,
          filter: "all",
        }
        return {payload: newTodolist}
      },
      (state, action) => {
        state.push(action.payload)
      },
    ),
  }),
})

export const todolistsReducer = todolistsSlice.reducer
export const {createTodolistAC, deleteTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC} =
  todolistsSlice.actions

export type Todolist = {
  id: string
  title: string
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
