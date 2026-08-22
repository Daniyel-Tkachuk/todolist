import {createAsyncThunk, createSlice, nanoid} from "@reduxjs/toolkit"
import type {Todolist} from "@/features/todolists/api/todolistsApi.types"
import {todolistsApi} from "@/features/todolists/api/todolistsApi"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    deleteTodolistAC: create.reducer<{id: string}>((state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }),
    changeTodolistFilterAC: create.reducer<{id: string; filter: FilterValues}>((state, action) => {
      const {id, filter} = action.payload
      const index = state.findIndex((tl) => tl.id === id)
      if (index !== -1) {
        state[index].filter = filter
      }
    }),
    createTodolistAC: create.preparedReducer(
      (title: string) => {
        const newTodolist: DomainTodolist = {
          id: nanoid(),
          title,
          filter: "all",
        }
        return {payload: newTodolist}
      },
      (state, action) => {
        state.push(action.payload)
      },
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolistsTC.fulfilled, (_state, action) => {
        const {todolists} = action.payload
        return todolists.map((tl) => ({...tl, filter: "all"}))
      })
      .addCase(fetchTodolistsTC.rejected, (_state, action: any) => {
        console.log(action.payload.message)
      })
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
  },
})

// ***Thunks***

export const fetchTodolistsTC = createAsyncThunk(
  `${todolistsSlice.name}/fetchTodolists}`,
  async (_args, {rejectWithValue}) => {
    try {
      const res = await todolistsApi.getTodolists()
      return {todolists: res.data}
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

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

export const todolistsReducer = todolistsSlice.reducer
export const {createTodolistAC, deleteTodolistAC, changeTodolistFilterAC} = todolistsSlice.actions

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
