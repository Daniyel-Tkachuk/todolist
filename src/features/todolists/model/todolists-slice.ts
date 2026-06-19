import {Todolist} from "@/features/todolists/api/todolistsApi.types"
import {todolistsApi} from "@/features/todolists/api/todolistsApi"
import {createAppSlice} from "@/common/utils"
import {changeAppStatus} from "@/app/app-slice"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    fetchTodolistsTC: create.asyncThunk(
      async (_, {rejectWithValue, dispatch}) => {
        try {
          dispatch(changeAppStatus("loading"))
          const response = await todolistsApi.getTodolists()
          dispatch(changeAppStatus("succeeded"))
          return response.data
        } catch (error) {
          dispatch(changeAppStatus("failed"))
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (_, action) => {
          const todolists: DomainTodolist[] = action.payload.map((tl) => ({...tl, filter: "all"}))
          return todolists
        },
      },
    ),
    deleteTodolistTC: create.asyncThunk(
      async (id: string, {rejectWithValue, dispatch}) => {
        try {
          dispatch(changeAppStatus("loading"))
          await todolistsApi.deleteTodolist(id)
          dispatch(changeAppStatus("succeeded"))
          return {id}
        } catch (error) {
          dispatch(changeAppStatus("failed"))
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((tl) => tl.id === action.payload.id)
          if (index !== -1) {
            state.splice(index, 1)
          }
        },
      },
    ),
    createTodolistTC: create.asyncThunk(
      async (title: string, {rejectWithValue, dispatch}) => {
        try {
          dispatch(changeAppStatus("loading"))
          const res = await todolistsApi.createTodolist(title)
          dispatch(changeAppStatus("succeeded"))
          return {todolist: res.data.data.item}
        } catch (error) {
          dispatch(changeAppStatus("failed"))
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const newTodolist: DomainTodolist = {...action.payload.todolist, filter: "all"}
          state.unshift(newTodolist)
        },
      },
    ),
    changeTodolistTitleTC: create.asyncThunk(
      async (args: {id: string; title: string}, {rejectWithValue, dispatch}) => {
        try {
          dispatch(changeAppStatus("loading"))
          await todolistsApi.changeTodolistTitle(args)
          dispatch(changeAppStatus("succeeded"))
          return args
        } catch (error) {
          dispatch(changeAppStatus("failed"))
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const todolist = state.find((tl) => tl.id === action.payload.id)
          if (todolist) {
            todolist.title = action.payload.title
          }
        },
      },
    ),
    changeTodolistFilter: create.reducer<{id: string; filter: FilterValues}>((state, action) => {
      const {id, filter} = action.payload
      const index = state.findIndex((tl) => tl.id === id)
      if (index !== -1) {
        state[index].filter = filter
      }
    }),
  }),
  selectors: {
    selectTodolists: (state) => state,
  },
})

export const todolistsReducer = todolistsSlice.reducer
export const {changeTodolistFilter, fetchTodolistsTC, deleteTodolistTC, createTodolistTC, changeTodolistTitleTC} =
  todolistsSlice.actions
export const {selectTodolists} = todolistsSlice.selectors

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
