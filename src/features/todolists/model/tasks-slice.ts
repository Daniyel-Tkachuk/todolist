import {createAppSlice} from "@/common/utils"
import {tasksApi} from "@/features/todolists/api/tasksApi"
import {DomainTask, type UpdateTaskModel} from "@/features/todolists/api/tasksApi.types"
import {changeAppStatus} from "@/app/app-slice"
import {createTodolistTC, deleteTodolistTC} from "@/features/todolists/model/todolists-slice"
import type {RootState} from "@/app/store"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => ({
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
    updateTaskTC: create.asyncThunk(
      async (
        args: {todolistId: string; taskId: string; model: Partial<UpdateTaskModel>},
        {rejectWithValue, getState, dispatch},
      ) => {
        try {
          const {todolistId, taskId, model} = args

          const tasks = (getState() as RootState).tasks[todolistId]
          const task = tasks.find((t) => t.id === taskId)

          if (!task) {
            return rejectWithValue(null)
          }

          const domainModel: UpdateTaskModel = {
            startDate: task.startDate,
            description: task.description,
            title: task.title,
            status: task.status,
            priority: task.priority,
            deadline: task.deadline,
            ...model,
          }

          dispatch(changeAppStatus("loading"))
          const res = await tasksApi.updateTask({todolistId, taskId, domainModel})
          dispatch(changeAppStatus("succeeded"))
          return {updatedTask: res.data.data.item}
        } catch (error) {
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const {updatedTask} = action.payload
          const arrTasks = state[updatedTask.todoListId]
          const index = arrTasks.findIndex((t) => t.id === updatedTask.id)
          if (index !== -1) {
            arrTasks[index] = updatedTask
          }
        },
      },
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        const {id: todolistId} = action.payload.todolist
        state[todolistId] = []
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
export const {fetchTasksTC, createTaskTC, deleteTaskTC, updateTaskTC} = tasksSlice.actions
export const {selectTasks} = tasksSlice.selectors

export type TasksState = Record<string, DomainTask[]>
