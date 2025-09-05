import { nanoid } from "@reduxjs/toolkit"
import { createTodolistTC, deleteTodolistTC } from "./todolistsSlice.ts"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { TaskPriority, TaskStatus } from "@/common/enums"

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
      },
    ),
    deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>(
      (state, { payload: { todolistId, taskId } }) => {
        const tasks = state[todolistId]
        const taskIndex = tasks.findIndex((task) => task.id === taskId)
        if (taskIndex !== -1) {
          tasks.splice(taskIndex, 1)
        }
      },
    ),
    createTaskAC: create.reducer<{ todolistId: string; title: string }>((state, { payload: { todolistId, title } }) => {
      const newTask: DomainTask = {
        id: nanoid(),
        title,
        status: TaskStatus.New,
        description: "",
        priority: TaskPriority.Low,
        startDate: "",
        deadline: "",
        todoListId: "",
        order: 0,
        addedDate: "",
      }
      state[todolistId].unshift(newTask)
    }),
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

export const {fetchTasksTC, deleteTaskAC, createTaskAC, changeTaskStatusAC, changeTaskTitleAC } = tasksSlice.actions
export const { selectTasks } = tasksSlice.selectors
export const tasksReducer = tasksSlice.reducer

export type TasksState = Record<string, DomainTask[]>
