import type {Todolist} from "@/features/todolists/api/todolistsApi.types"
import {todolistsApi} from "@/features/todolists/api/todolistsApi"
import {createAppSlice} from "@/common/utils"
import {setAppStatusAC} from "@/app/app-slice"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  reducers: (create) => ({
    // ✅ thunks
    fetchTodolistsTC: create.asyncThunk(
      async (_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
          dispatch(setAppStatusAC({status: "loading"}))
          const result = await todolistsApi.getTodolists()
          dispatch(setAppStatusAC({status: "succeeded"}))
          return {todolists: result.data}
        } catch (error) {
          dispatch(setAppStatusAC({status: "failed"}))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const {todolists} = action.payload
          // return todolists.map((tl) => ({...tl, filter: "all"}))
          todolists.forEach((tl) => {
            state.push({...tl, filter: "all"})
          })
        },
        rejected: (_, action: any) => {
          console.log(action.payload.message)
        },
      },
    ),
    deleteTodolistTC: create.asyncThunk(
      async (id: string, {dispatch, rejectWithValue}) => {
        try {
          dispatch(setAppStatusAC({status: "loading"}))
          await todolistsApi.deleteTodolist(id)
          dispatch(setAppStatusAC({status: "succeeded"}))
          return {id}
        } catch (error) {
          dispatch(setAppStatusAC({status: "failed"}))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((tl) => tl.id === action.payload.id)
          if (index !== -1) {
            state.splice(index, 1)
          }
        },
        rejected: (_, action: any) => {
          console.log(action.payload.message)
        },
      },
    ),
    createTodolistTC: create.asyncThunk(
      async (args: {title: string}, {dispatch, rejectWithValue}) => {
        try {
          dispatch(setAppStatusAC({status: "loading"}))
          const res = await todolistsApi.createTodolist(args.title)
          dispatch(setAppStatusAC({status: "succeeded"}))
          return {todolist: res.data.data.item}
        } catch (error) {
          dispatch(setAppStatusAC({status: "failed"}))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const newTodolist: DomainTodolist = {...action.payload.todolist, filter: "all"}
          state.push(newTodolist)
        },
        rejected: (_, action: any) => {
          console.log(action.payload.message)
        },
      },
    ),
    changeTodolistTitleTC: create.asyncThunk(
      async (args: {id: string; title: string}, {dispatch, rejectWithValue}) => {
        try {
          dispatch(setAppStatusAC({status: "loading"}))
          await todolistsApi.changeTodolistTitle(args)
          dispatch(setAppStatusAC({status: "succeeded"}))
          return args
        } catch (error) {
          dispatch(setAppStatusAC({status: "failed"}))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const {id, title} = action.payload
          const index = state.findIndex((tl) => tl.id === id)
          if (index !== -1) {
            state[index].title = title
          }
        },
        rejected: (_, action: any) => {
          console.log(action.payload.message)
        },
      },
    ),
    // ✅ actions
    changeTodolistFilterAC: create.reducer<{id: string; filter: FilterValues}>((state, action) => {
      const {id, filter} = action.payload
      const index = state.findIndex((tl) => tl.id === id)
      if (index !== -1) {
        state[index].filter = filter
      }
    }),
  }),
})

export const todolistsReducer = todolistsSlice.reducer
export const {changeTodolistFilterAC, fetchTodolistsTC, changeTodolistTitleTC, createTodolistTC, deleteTodolistTC} =
  todolistsSlice.actions
export const {selectTodolists} = todolistsSlice.selectors

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
