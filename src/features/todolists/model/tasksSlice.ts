import { createSlice, nanoid } from "@reduxjs/toolkit"
import { createTodolistTC, deleteTodolistTC } from "./todolistsSlice.ts"

export const tasksSlice = createSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => ({
    deleteTaskAC: create.reducer<{todolistId: string, taskId: string}>((state, {payload: {todolistId, taskId}}) => {
      const tasks = state[todolistId]
      const taskIndex = tasks.findIndex((task) => task.id === taskId)
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1)
      }
    }),
    createTaskAC: create.reducer<{todolistId: string, title: string}>((state, {payload: {todolistId, title}}) => {
      const newTask: Task = {
        id: nanoid(),
        title,
        isDone: false
      }
      state[todolistId].unshift(newTask)
    }),
    changeTaskStatusAC: create.reducer<{ todolistId: string; taskId: string; isDone: boolean }>((state, {payload}) => {
      const task = state[payload.todolistId].find(task => task.id === payload.taskId)
      if (task) {
        task.isDone = payload.isDone
      }
    }),
    changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, {payload}) => {
      const task = state[payload.todolistId].find(task => task.id === payload.taskId)
      if (task) {
        task.title = payload.title
      }
    })
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, {payload}) => {
        state[payload.todolist.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, {payload}) => {
        delete state[payload.id]
      })
  },
  selectors: {
    selectTasks: (state) => state
  }
})

export const {deleteTaskAC, createTaskAC, changeTaskStatusAC, changeTaskTitleAC} = tasksSlice.actions
export const {selectTasks} = tasksSlice.selectors
export const tasksReducer = tasksSlice.reducer


export type Task = {
  id: string
  title: string
  isDone: boolean
}

export type TasksState = Record<string, Task[]>
