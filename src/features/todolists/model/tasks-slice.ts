import {createTodolist, deleteTodolist} from "./todolists-slice.ts"
import {createSlice, nanoid} from "@reduxjs/toolkit"

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => ({
    deleteTask: create.reducer<{todolistId: string; taskId: string}>((state, action) => {
      const {todolistId, taskId} = action.payload
      const tasks = state[todolistId]
      const index = tasks.findIndex((t) => t.id === taskId)
      if (index !== -1) {
        tasks.splice(index, 1)
      }
    }),
    createTask: create.reducer<{todolistId: string; title: string}>((state, action) => {
      const {todolistId, title} = action.payload
      const newTask: Task = {id: nanoid(), title, isDone: false}
      state[todolistId].push(newTask)
    }),
    changeTaskStatus: create.reducer<{todolistId: string; taskId: string; isDone: boolean}>((state, action) => {
      const {todolistId, taskId, isDone} = action.payload
      const tasks = state[todolistId]
      const task = tasks.find((t) => t.id === taskId)
      if (task) {
        task.isDone = isDone
      }
    }),
    changeTaskTitle: create.reducer<{todolistId: string; taskId: string; title: string}>((state, action) => {
      const {todolistId, taskId, title} = action.payload
      const tasks = state[todolistId]
      const task = tasks.find((t) => t.id === taskId)
      if (task) {
        task.title = title
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolist, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(deleteTodolist, (state, action) => {
        delete state[action.payload.id]
      })
  },
})

export const tasksReducer = tasksSlice.reducer
export const {deleteTask, changeTaskStatus, changeTaskTitle, createTask} = tasksSlice.actions

export type Task = {
  id: string
  title: string
  isDone: boolean
}

export type TasksState = Record<string, Task[]>
