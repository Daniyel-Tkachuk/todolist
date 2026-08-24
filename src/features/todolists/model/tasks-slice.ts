import {createSlice, nanoid} from "@reduxjs/toolkit"
import {createTodolistAC, deleteTodolistAC, fetchTodolistsTC} from "./todolists-slice"

export const tasksSlice = createSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  reducers: (create) => ({
    deleteTaskAC: create.reducer<{todolistId: string; taskId: string}>((state, action) => {
      const {taskId, todolistId} = action.payload
      const tasks = state[todolistId]
      const index = tasks.findIndex((t) => t.id === taskId)
      if (index !== -1) {
        tasks.splice(index, 1)
      }
    }),
    changeTaskStatusAC: create.reducer<{todolistId: string; taskId: string; isDone: boolean}>((state, action) => {
      const {taskId, todolistId, isDone} = action.payload
      const task = state[todolistId].find((t) => t.id === taskId)
      if (task) {
        task.isDone = isDone
      }
    }),
    changeTaskTitleAC: create.reducer<{todolistId: string; taskId: string; title: string}>((state, action) => {
      const {taskId, todolistId, title} = action.payload
      const task = state[todolistId].find((t) => t.id === taskId)
      if (task) {
        task.title = title
      }
    }),
    createTaskAC: create.reducer<{todolistId: string; title: string}>((state, action) => {
      const {title, todolistId} = action.payload
      const newTask: Task = {id: nanoid(), title, isDone: false}
      state[todolistId].unshift(newTask)
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
        action.payload.todolists.forEach(({id}) => {
          if (!state[id]) {
            state[id] = []
          }
        })
      })
      .addCase(fetchTodolistsTC.rejected, (_state, action: any) => {
        console.log(action.payload.message)
      })
      .addCase(createTodolistAC, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(deleteTodolistAC, (state, action) => {
        delete state[action.payload.id]
      })
  },
})

export const tasksReducer = tasksSlice.reducer
export const {deleteTaskAC, changeTaskStatusAC, changeTaskTitleAC, createTaskAC} = tasksSlice.actions
export const {selectTasks} = tasksSlice.selectors

export type Task = {
  id: string
  title: string
  isDone: boolean
}

export type TasksState = Record<string, Task[]>
