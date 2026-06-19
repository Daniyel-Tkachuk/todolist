import {nanoid} from "@reduxjs/toolkit"
import {createTodolistTC, deleteTodolistTC} from "@/features/todolists/model/todolists-slice"
import {createAppSlice} from "@/common/utils"
import {tasksApi} from "@/features/todolists/api/tasksApi"
import {DomainTask} from "@/features/todolists/api/tasksApi.types"
import {TaskPriority, TaskStatus, TaskStatusType} from "@/common/enums"
import {changeAppStatus} from "@/app/app-slice"

export const tasksSlice = createAppSlice({
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
      const newTask: DomainTask = {
        id: nanoid(),
        title,
        status: TaskStatus.New,
        description: null,
        priority: TaskPriority.Low,
        startDate: null,
        deadline: null,
        todoListId: todolistId,
        order: 0,
        addedDate: "",
      }
      state[todolistId].push(newTask)
    }),
    changeTaskStatus: create.reducer<{todolistId: string; taskId: string; status: TaskStatusType}>((state, action) => {
      const {todolistId, taskId, status} = action.payload
      const tasks = state[todolistId]
      const task = tasks.find((t) => t.id === taskId)
      if (task) {
        task.status = status
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

    fetchTasksTC: create.asyncThunk(
      async (args: {todolistId: string}, {rejectWithValue}) => {
        try {
          const {todolistId} = args
          const res = await tasksApi.getTasks(todolistId)
          return {items: res.data.items, todolistId}
        } catch (error) {
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const {todolistId, items} = action.payload
          state[todolistId] = items
        },
      },
    ),
    createTaskTC: create.asyncThunk(
      async (args: {todolistId: string; title: string}, {rejectWithValue, dispatch}) => {
        try {
          dispatch(changeAppStatus("loading"))
          const res = await tasksApi.createTask(args)
          dispatch(changeAppStatus("succeeded"))
          return {newTask: res.data.data.item}
        } catch (error) {
          dispatch(changeAppStatus("failed"))
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const {newTask} = action.payload
          state[newTask.todoListId].unshift(newTask)
        },
      },
    ),
    deleteTaskTC: create.asyncThunk(
      async (args: {todolistId: string; taskId: string}, {rejectWithValue}) => {
        try {
          await tasksApi.deleteTask(args)
          return args
        } catch (error) {
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const {todolistId, taskId} = action.payload
          const index = state[todolistId].findIndex((t) => t.id === taskId)
          if (index !== -1) {
            state[todolistId].splice(index, 1)
          }
        },
      },
    ),
    changeTaskStatusTC: create.asyncThunk(
      async (domainTask: DomainTask, {rejectWithValue}) => {
        try {
          const res = await tasksApi.updateTask(domainTask)
          return res.data.data.item
        } catch (error) {
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const {todoListId, id: taskId, status: newStatus} = action.payload
          const task = state[todoListId].find((t) => t.id === taskId)
          if (task) {
            task.status = newStatus
          }
        },
      },
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        const todoId = action.payload.todolist.id
        state[todoId] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
  selectors: {
    selectTasks: (state) => state,
  },
})

export const tasksReducer = tasksSlice.reducer
export const {
  fetchTasksTC,
  createTaskTC,
  deleteTaskTC,
  changeTaskStatusTC,
  deleteTask,
  changeTaskStatus,
  changeTaskTitle,
  createTask,
} = tasksSlice.actions
export const {selectTasks} = tasksSlice.selectors

export type Task = {
  id: string
  title: string
  isDone: boolean
}

export type TasksState = Record<string, DomainTask[]>
