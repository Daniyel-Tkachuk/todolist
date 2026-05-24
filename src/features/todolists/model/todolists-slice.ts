import {createAsyncThunk, createSlice, nanoid} from "@reduxjs/toolkit"
import {Todolist} from "@/features/todolists/api/todolistsApi.types"
import {todolistsApi} from "@/features/todolists/api/todolistsApi"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    /*setTodolists: create.reducer<Todolist[]>((_, action) => {
      const todolists = action.payload
      return todolists.map((tl) => ({...tl, filter: "all"}))
    }),*/
    deleteTodolist: create.reducer<{id: string}>((state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }),
    createTodolist: create.preparedReducer(
      (title: string) => {
        const newTodolist: DomainTodolist = {
          id: nanoid(),
          title,
          addedDate: "",
          order: 1,
          filter: "all",
        }
        return {payload: newTodolist}
      },
      (state, action) => {
        state.push(action.payload)
      },
    ),
    /*changeTodolistTitle: create.reducer<{id: string; title: string}>((state, action) => {
      const {id, title} = action.payload
      const index = state.findIndex((tl) => tl.id === id)
      if (index !== -1) {
        state[index].title = title
      }
    }),*/
    changeTodolistFilter: create.reducer<{id: string; filter: FilterValues}>((state, action) => {
      const {id, filter} = action.payload
      const index = state.findIndex((tl) => tl.id === id)
      if (index !== -1) {
        state[index].filter = filter
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolistsTC.fulfilled, (_state, action) => {
        const todolists: DomainTodolist[] = action.payload.map((tl) => ({...tl, filter: "all"}))
        return todolists
      })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const {id, title} = action.payload
        const index = state.findIndex((tl) => tl.id === id)
        if (index !== -1) {
          state[index].title = title
        }
      })
  },
  selectors: {
    selectTodolists: (state) => state,
  },
})

// ---- Thunks ----

export const fetchTodolistsTC = createAsyncThunk(
  `${todolistsSlice.name}/fetchTodolists`,
  async (_arg, {rejectWithValue}) => {
    try {
      const response = await todolistsApi.getTodolists()
      return response.data
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
export const {deleteTodolist, createTodolist, changeTodolistFilter} = todolistsSlice.actions
export const {selectTodolists} = todolistsSlice.selectors

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
