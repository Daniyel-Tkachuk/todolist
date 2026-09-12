import {createTodolistTC, deleteTodolistTC} from "./todolists-slice"
import {createAppSlice} from "@/common/utils"
import {tasksApi} from "@/features/todolists/api/tasksApi"
import type {DomainTask, UpdateTaskModel} from "@/features/todolists/api/tasksApi.types"
import {setAppStatusAC} from "@/app/app-slice"
import type {RootState} from "@/app/store"

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
    updateTaskTC: create.asyncThunk(
      async (
        args: {todolistId: string; taskId: string; domainModel: Partial<UpdateTaskModel>},
        {rejectWithValue, dispatch, getState},
      ) => {
        try {
          const {taskId, todolistId} = args

          const allTasks = (getState() as RootState).tasks
          const tasksForTodolist = allTasks[todolistId]
          const task = tasksForTodolist.find((tl) => tl.id === taskId)

          if (!task) {
            return rejectWithValue(null)
          }

          const model: UpdateTaskModel = {
            title: task.title,
            status: task.status,
            startDate: task.startDate,
            priority: task.priority,
            description: task.description,
            deadline: task.deadline,
            ...args.domainModel,
          }

          dispatch(setAppStatusAC({status: "loading"}))
          const res = await tasksApi.updateTask({todolistId, taskId, model})
          dispatch(setAppStatusAC({status: "succeeded"}))
          return {task: res.data.data.item}
        } catch (error) {
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const {task} = action.payload
          const index = state[task.todoListId].findIndex((t) => t.id === task.id)
          if (index !== -1) {
            state[task.todoListId][index] = task
          }
        },
      },
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
})

export const tasksReducer = tasksSlice.reducer
export const {deleteTaskTC, createTaskTC, fetchTasksTC, updateTaskTC} = tasksSlice.actions
export const {selectTasks} = tasksSlice.selectors

export type TasksState = Record<string, DomainTask[]>
