import {createTodolistAC, deleteTodolistAC} from './todolists-reducer.ts'
import {createAction, createReducer, nanoid} from "@reduxjs/toolkit";

export type Task = {
  id: string
  title: string
  isDone: boolean
}

export type TasksState = Record<string, Task[]>


export const deleteTaskAC = createAction<{ todolistId: string, taskId: string }>('tasks/delete_task')
export const createTaskAC = createAction<{ todolistId: string, title: string }>('tasks/createTaskAC')
export const changeTaskStatusAC = createAction<{
  todolistId: string,
  taskId: string,
  isDone: boolean
}>('tasks/change_task_status')
export const changeTaskTitleAC = createAction<{
  todolistId: string,
  taskId: string,
  title: string
}>('tasks/change_task_title')


const initialState: TasksState = {}

export const tasksReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(deleteTodolistAC, (state, action) => {
      delete state[action.payload.id]
    })
    .addCase(createTodolistAC, (state, action) => {
      state[action.payload.id] = []
    })
    .addCase(deleteTaskAC, (state, action) => {
      const {taskId, todolistId} = action.payload
      if (!state[todolistId]) return
      const index = state[todolistId].findIndex(t => t.id === taskId)
      if (index !== -1) state[todolistId].splice(index, 1)
    })
    .addCase(createTaskAC, (state, action) => {
      const {todolistId, title} = action.payload
      const newTask: Task = {id: nanoid(), title, isDone: false}
      if (state[todolistId]) state[todolistId].unshift(newTask)
    })
    .addCase(changeTaskStatusAC, (state, action) => {
      const {todolistId, taskId, isDone} = action.payload
      const task = state[todolistId].find(t => t.id === taskId)
      if (task) task.isDone = isDone
    })
    .addCase(changeTaskTitleAC, (state, action) => {
      const {todolistId, taskId, title} = action.payload
      const task = state[todolistId].find(t => t.id === taskId)
      if (task) task.title = title
    })
})