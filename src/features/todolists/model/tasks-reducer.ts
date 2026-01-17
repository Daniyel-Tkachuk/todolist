import {createTodolistAC, deleteTodolistAC} from './todolists-reducer.ts'
import {createAction, createReducer, nanoid} from "@reduxjs/toolkit";

export type Task = {
  id: string
  title: string
  isDone: boolean
}

export type TasksState = Record<string, Task[]>

const initialState: TasksState = {}

export const deleteTaskAC = createAction<{todolistId: string, taskId: string}>('tasks/deleteTask')
export const createTaskAC = createAction<{todolistId: string, title: string}>('tasks/createTask')
export const changeTaskStatusAC = createAction<{ todolistId: string, taskId: string, isDone: boolean }>('tasks/changeTaskStatus')
export const changeTaskTitleAC = createAction<{ todolistId: string, taskId: string, title: string }>('tasks/changeTaskTitle')

export const tasksReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(deleteTaskAC, (state, action) => {
      const {todolistId, taskId} = action.payload
      const index = state[todolistId].findIndex(task => task.id === taskId)
      if (index !== -1) {
        state[todolistId].splice(index, 1)
      }
    })
    .addCase(createTaskAC, (state, action) => {
      const {todolistId, title} = action.payload
      const newTask: Task = {id: nanoid(), title, isDone: false}
      state[todolistId].unshift(newTask)
    })
    .addCase(changeTaskTitleAC, (state, action) => {
      const {todolistId, taskId, title} = action.payload
      const task = state[todolistId].find(task => task.id === taskId)
      if (task) {
        task.title = title
      }
    })
    .addCase(changeTaskStatusAC, (state, action) => {
      const {todolistId, taskId, isDone} = action.payload
      const task = state[todolistId].find(task => task.id === taskId)
      if (task) {
        task.isDone = isDone
      }
    })
    .addCase(deleteTodolistAC, (state, action) => {
      delete state[action.payload.id]
    })
    .addCase(createTodolistAC, (state, action) => {
      state[action.payload.id] = []
    })
})
