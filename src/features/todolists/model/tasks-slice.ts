import {createTodolistTC, deleteTodolistTC, fetchTodolistsTC} from "./todolists-slice"
import {createAppSlice} from "@/common/utils"
import {tasksApi} from "@/features/todolists/api/tasksApi"
import type {DomainTask, UpdateTaskModel} from "@/features/todolists/api/tasksApi.types"
import type {RootState} from "@/app/store"
import {setAppStatusAC} from "@/app/app-slice"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  reducers: (create) => ({
    // ✅ thunks
    fetchTasksTC: create.asyncThunk(
      async (todolistId: string, {dispatch, rejectWithValue}) => {
        try {
          dispatch(setAppStatusAC({status: "loading"}))
          const result = await tasksApi.getTasks(todolistId)
          dispatch(setAppStatusAC({status: "succeeded"}))
          return {todolistId, tasks: result.data.items}
        } catch (error) {
          dispatch(setAppStatusAC({status: "failed"}))
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const {todolistId, tasks} = action.payload
          state[todolistId] = tasks
        },
        rejected: (_, action: any) => {
          console.log(action.payload.message)
        },
      },
    ),
    createTaskTC: create.asyncThunk(
      async (args: {todolistId: string; title: string}, {dispatch, rejectWithValue}) => {
        try {
          dispatch(setAppStatusAC({status: "loading"}))
          const res = await tasksApi.createTask(args)
          dispatch(setAppStatusAC({status: "succeeded"}))
          return {task: res.data.data.item}
        } catch (error) {
          dispatch(setAppStatusAC({status: "failed"}))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const {task} = action.payload
          state[task.todoListId].unshift(task)
        },
        rejected: (_, action: any) => {
          console.log(action.payload.message)
        },
      },
    ),
    deleteTaskTC: create.asyncThunk(
      async (args: {todolistId: string; taskId: string}, {dispatch, rejectWithValue}) => {
        try {
          dispatch(setAppStatusAC({status: "loading"}))
          await tasksApi.deleteTask(args)
          dispatch(setAppStatusAC({status: "succeeded"}))
          return args
        } catch (error) {
          dispatch(setAppStatusAC({status: "failed"}))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const {taskId, todolistId} = action.payload
          const tasks = state[todolistId]
          const index = tasks.findIndex((t) => t.id === taskId)
          if (index !== -1) {
            tasks.splice(index, 1)
          }
        },
        rejected: (_, action: any) => {
          console.log(action.payload.message)
        },
      },
    ),
    changeTaskStatusTC: create.asyncThunk(
      async (
        args: {todolistId: string; taskId: string; model: UpdateTaskModel},
        {dispatch, rejectWithValue, getState},
      ) => {
        try {
          const {todolistId, taskId} = args

          dispatch(setAppStatusAC({status: "loading"}))

          const allTasks = (getState() as RootState).tasks
          const tasksForTodolist = allTasks[todolistId]
          const task = tasksForTodolist.find((t) => t.id === taskId)

          if (!task) {
            return rejectWithValue(null)
          }

          const res = await tasksApi.updateTask(args)
          dispatch(setAppStatusAC({status: "succeeded"}))
          return {task: res.data.data.item}
        } catch (error) {
          dispatch(setAppStatusAC({status: "failed"}))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const {todoListId, id, status} = action.payload.task

          const task = state[todoListId].find((t) => t.id === id)
          if (task) {
            task.status = status
          }
        },
        rejected: (_, action: any) => {
          console.log(action.payload.message)
        },
      },
    ),
    // ✅ actions
    changeTaskTitleAC: create.reducer<{todolistId: string; taskId: string; title: string}>((state, action) => {
      const {taskId, todolistId, title} = action.payload
      const task = state[todolistId].find((t) => t.id === taskId)
      if (task) {
        task.title = title
      }
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
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
})

export const tasksReducer = tasksSlice.reducer
export const {deleteTaskTC, changeTaskStatusTC, changeTaskTitleAC, createTaskTC, fetchTasksTC} = tasksSlice.actions
export const {selectTasks} = tasksSlice.selectors

export type TasksState = Record<string, DomainTask[]>
