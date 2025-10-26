import { createTodolistTC, deleteTodolistTC } from "./todolistsSlice.ts"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { changeAppStatusAC } from "@/app/appSlice.ts"
import { RootState } from "@/app/store.ts"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => ({
    fetchTasksTC: create.asyncThunk(
      async (todolistId: string, { rejectWithValue, dispatch }) => {
        try {
          dispatch(changeAppStatusAC({ status: "loading" }))
          const res = await tasksApi.getTasks(todolistId)
          return { todolistId, tasks: res.data.items }
        } catch (error) {
          dispatch(changeAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        } finally {
          dispatch(changeAppStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
        rejected: (_state, action: any) => {
          console.log(action.payload.message)
        },
      },
    ),
    createTaskTC: create.asyncThunk(
      async (args: { todolistId: string; title: string }, { rejectWithValue, dispatch }) => {
        try {
          dispatch(changeAppStatusAC({ status: "loading" }))
          const res = await tasksApi.createTask(args)
          return res.data.data.item
        } catch (error) {
          dispatch(changeAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        } finally {
          dispatch(changeAppStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (state, action) => {
          const newTask = action.payload
          state[action.payload.todoListId].unshift(newTask)
        },
        rejected: (_state, action: any) => {
          console.log(action.payload.message)
        },
      },
    ),
    deleteTaskTC: create.asyncThunk(
      async (args: { todolistId: string; taskId: string }, { rejectWithValue, dispatch }) => {
        try {
          dispatch(changeAppStatusAC({ status: "loading" }))
          await tasksApi.deleteTask(args)
          return args
        } catch (error) {
          dispatch(changeAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        } finally {
          dispatch(changeAppStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (state, action) => {
          const tasks = state[action.payload.todolistId]
          const taskIndex = tasks.findIndex((task) => task.id === action.payload.taskId)
          if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1)
          }
        },
        rejected: (_state, action: any) => {
          console.log(action.payload.message)
        },
      },
    ),
    updateTaskTC: create.asyncThunk(
      async (
        args: {
          todolistId: string
          taskId: string
          model: Partial<UpdateTaskModel>
        },
        { getState, dispatch, rejectWithValue },
      ) => {
        try {
          const state = (getState() as RootState).tasks
          const task = state[args.todolistId].find((task) => task.id === args.taskId)

          if (!task) {
            return rejectWithValue("Task not found")
          }

          const domainModel: UpdateTaskModel = {
            ...task,
            ...args.model,
          }

          dispatch(changeAppStatusAC({ status: "loading" }))
          const res = await tasksApi.updateTask({ ...args, model: domainModel })
          return res.data.data.item
        } catch (e) {
          dispatch(changeAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        } finally {
          dispatch(changeAppStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (state, action) => {
          const updatedTask = action.payload
          const tasks = state[updatedTask.todoListId]
          const index = tasks.findIndex((task) => task.id === updatedTask.id)
          if (index !== -1) {
            tasks[index] = updatedTask
          }
        },
        rejected: (_state, action: any) => {
          console.log(action.payload.message)
        },
      },
    ),
  }),
  /*changeTaskStatusTC: create.asyncThunk(
      async (task: DomainTask, { rejectWithValue }) => {
        try {
          const model: UpdateTaskModel = {
            status: task.status,
            title: task.title,
            startDate: task.startDate,
            description: task.description,
            deadline: task.deadline,
            priority: task.priority,
          }

          const res = await tasksApi.updateTask({ taskId: task.id, todolistId: task.todoListId, model })
          return res.data.data.item
        } catch (error) {
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const { id, todoListId, status } = action.payload
          const task = state[todoListId].find((task) => task.id === id)
          if (task) {
            task.status = status
          }
        },
        rejected: (_state, action: any) => {
          console.log(action.payload.message)
        },
      },
    ),*/
  /*changeTaskTitleTC: create.asyncThunk(
    async (task: DomainTask, { rejectWithValue }) => {
      try {
        const model: UpdateTaskModel = {
          status: task.status,
          title: task.title,
          deadline: task.deadline,
          priority: task.priority,
          description: task.description,
          startDate: task.startDate,
        }

        const res = await tasksApi.updateTask({ todolistId: task.todoListId, taskId: task.id, model })
        return res.data.data.item
      } catch (e) {
        return rejectWithValue(null)
      }
    },
    {
      fulfilled: (state, action) => {
        const { id, todoListId, title } = action.payload
        const task = state[todoListId].find((task) => task.id === id)
        if (task) {
          task.title = title
        }
      },
      rejected: (_state, action: any) => {
        console.log(action.payload.message)
      }
    },
  ),*/
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, { payload }) => {
        state[payload.newTodolist.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, { payload }) => {
        delete state[payload.todoId]
      })
  },
  selectors: {
    selectTasks: (state) => state,
  },
})

export const { fetchTasksTC, deleteTaskTC, createTaskTC, updateTaskTC } = tasksSlice.actions
export const { selectTasks } = tasksSlice.selectors
export const tasksReducer = tasksSlice.reducer

export type TasksState = Record<string, DomainTask[]>
