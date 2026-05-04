import {createTodolistAC, deleteTodolistAC} from './todolists-reducer.ts'
import {createAction, createReducer, nanoid} from "@reduxjs/toolkit";

export const deleteTaskAC = createAction<{todolistId: string, taskId: string}>('tasks/deleteTask')
export const createTaskAC = createAction<{todolistId: string, title: string}>('tasks/createTask')
export const changeTaskStatusAC = createAction<{todolistId: string, taskId: string, isDone: boolean}>('tasks/changeTaskStatus')
export const changeTaskTitleAC = createAction<{todolistId: string, taskId: string, title: string}>('tasks/changeTaskTitle')

const initialState: TasksState = {}

export const tasksReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(createTodolistAC, (state, action) => {
      state[action.payload.id] = []
    })
    .addCase(deleteTodolistAC, (state, action) => {
      delete state[action.payload.id]
    })
    .addCase(createTaskAC, (state, action) => {
      const {todolistId, title} = action.payload
      const newTask = {id: nanoid(), title, isDone: false}
      state[todolistId].push(newTask)
    })
    .addCase(deleteTaskAC, (state, action) => {
      const {todolistId, taskId} = action.payload
      const tasks = state[todolistId]
      const index = tasks.findIndex(t => t.id === taskId)
      if (index !== -1) tasks.splice(index, 1)
    })
    .addCase(changeTaskStatusAC, (state, action) => {
      const {todolistId, taskId, isDone} = action.payload
      const tasks = state[todolistId]
      const index = tasks.findIndex(t => t.id === taskId)
      if (index !== -1) tasks[index].isDone = isDone
    })
    .addCase(changeTaskTitleAC, (state, action) => {
      const {todolistId, taskId, title} = action.payload
      const tasks = state[todolistId]
      const index = tasks.findIndex(t => t.id === taskId)
      if (index !== -1) tasks[index].title = title
    })
})

export type Task = {
  id: string
  title: string
  isDone: boolean
}

type TasksState = Record<string, Task[]>