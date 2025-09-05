import { createTodolistTC, deleteTodolistTC } from "./todolistsSlice.ts"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { TaskStatus } from "@/common/enums"


export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => ({
    fetchTasksTC: create.asyncThunk(
      async (todolistId: string, { rejectWithValue }) => {
        try {
          const res = await tasksApi.getTasks(todolistId)
          return { todolistId, tasks: res.data.items }
        } catch (error) {
          return rejectWithValue(null)
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
      async (args: { todolistId: string; title: string }, { rejectWithValue }) => {
        try {
          const res = await tasksApi.createTask(args)
          return res.data.data.item
        } catch (error) {
          return rejectWithValue(null)
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
      async (args: { todolistId: string; taskId: string }, { rejectWithValue }) => {
        try {
          await tasksApi.deleteTask(args)
          return args
        } catch (error) {
          return rejectWithValue(null)
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
    changeTaskStatusTC: create.asyncThunk(
      async (
        task: DomainTask,
        { rejectWithValue },
      ) => {
        try {
          const model: UpdateTaskModel = {
            status: task.status,
            title: task.title,
            startDate: task.startDate,
            description: task.description,
            deadline: task.deadline,
            priority: task.priority,
          }

          const res = await tasksApi.updateTask({taskId: task.id, todolistId: task.todoListId, model})
          return res.data.data.item
        } catch (error) {
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const {id, todoListId, status} = action.payload
          const task = state[todoListId].find(task => task.id === id)
          if (task) {
            task.status = status
          }
        },
        rejected: (_state, action: any) => {
          console.log(action.payload.message)
        },
      },
    ),
    changeTaskStatusAC: create.reducer<{ todolistId: string; taskId: string; isDone: boolean }>(
      (state, { payload }) => {
        const task = state[payload.todolistId].find((task) => task.id === payload.taskId)
        if (task) {
          task.status = payload.isDone ? TaskStatus.Completed : TaskStatus.New
        }
      },
    ),
    changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, { payload }) => {
      const task = state[payload.todolistId].find((task) => task.id === payload.taskId)
      if (task) {
        task.title = payload.title
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, { payload }) => {
        state[payload.todolist.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, { payload }) => {
        delete state[payload.id]
      })
  },
  selectors: {
    selectTasks: (state) => state,
  },
})

export const { fetchTasksTC, deleteTaskTC, createTaskTC, changeTaskStatusTC, changeTaskTitleAC } = tasksSlice.actions
export const { selectTasks } = tasksSlice.selectors
export const tasksReducer = tasksSlice.reducer

export type TasksState = Record<string, DomainTask[]>
