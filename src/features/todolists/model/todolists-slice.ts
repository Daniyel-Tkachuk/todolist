import {createAsyncThunk} from "@reduxjs/toolkit"
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
    // ✅ actions
    changeTodolistFilterAC: create.reducer<{id: string; filter: FilterValues}>((state, action) => {
      const {id, filter} = action.payload
      const index = state.findIndex((tl) => tl.id === id)
      if (index !== -1) {
        state[index].filter = filter
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const {id, title} = action.payload
        const index = state.findIndex((tl) => tl.id === id)
        if (index !== -1) {
          state[index].title = title
        }
      })
      .addCase(changeTodolistTitleTC.rejected, (_state, action: any) => {
        console.log(action.payload.message)
      })
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        const newTodolist: DomainTodolist = {...action.payload.todolist, filter: "all"}
        state.push(newTodolist)
      })
      .addCase(createTodolistTC.rejected, (_state, action: any) => {
        console.log(action.payload.message)
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
      .addCase(deleteTodolistTC.rejected, (_state, action: any) => {
        console.log(action.payload.message)
      })
  },
})

// ***Thunks***

export const changeTodolistTitleTC = createAsyncThunk(
  `${todolistsSlice.name}/changeTodolistTitle`,
  async (args: {id: string; title: string}, {rejectWithValue}) => {
    try {
      await todolistsApi.changeTodolistTitle(args)
      return args
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const createTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/createTodolist`,
  async (args: {title: string}, {rejectWithValue}) => {
    try {
      const res = await todolistsApi.createTodolist(args.title)
      return {todolist: res.data.data.item}
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const deleteTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/deleteTodolist`,
  async (args: {id: string}, {rejectWithValue}) => {
    try {
      await todolistsApi.deleteTodolist(args.id)
      return {id: args.id}
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const todolistsReducer = todolistsSlice.reducer
export const {changeTodolistFilterAC, fetchTodolistsTC} = todolistsSlice.actions
export const {selectTodolists} = todolistsSlice.selectors

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
