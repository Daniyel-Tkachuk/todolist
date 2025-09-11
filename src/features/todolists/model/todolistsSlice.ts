import { createAsyncThunk } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { createAppSlice } from "@/common/utils"
import { changeAppStatusAC } from "@/app/appSlice.ts"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolists[],
  reducers: (create) => ({
    fetchTodolistsTC: create.asyncThunk(
      async (_arg, { rejectWithValue, dispatch }) => {
        try {
          dispatch(changeAppStatusAC({status: "loading"}))
          const res = await todolistsApi.getTodolists()
          return { todolists: res.data }
        } catch (error) {
          dispatch(changeAppStatusAC({status: "failed"}))
          return rejectWithValue(error)
        } finally {
          dispatch(changeAppStatusAC({status: "idle"}))
        }
      },
      {
        fulfilled: (_state, action) => action.payload.todolists.map((todolist) => ({ ...todolist, filter: "all" })),
        rejected: (_state, action: any) => {
          console.log(action.payload.message)
        },
      },
    ),
    deleteTodolistTC: create.asyncThunk(async (todoId: string, {rejectWithValue, dispatch}) => {
      try {
        dispatch(changeAppStatusAC({status: "loading"}))
        await todolistsApi.deleteTodolist(todoId)
        return {todoId}
      } catch (e) {
        return rejectWithValue(null)
      }
    }, {
      fulfilled: (state, action) => {
        const index = state.findIndex(todolist => todolist.id === action.payload.todoId)
        if (index !== -1) {
          state.splice(index, 1)
        }
      },
      rejected: (_state, action: any) => {
        console.log(action.payload.message)
      }
    }),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index !== -1) {
        state[index].filter = action.payload.filter
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      /*.addCase(fetchTodolistsTC.fulfilled, (_state, action) => {
        return action.payload.todolists.map((todolist) => {
          return { ...todolist, filter: "all" }
        })
      })
      .addCase(fetchTodolistsTC.rejected, (_state, action: any) => {
        console.log(action.payload.message)
      })*/
      .addCase(createTodolistTC.fulfilled, (state, { payload }) => {
        state.push({ ...payload.todolist, filter: "all" })
      })
      .addCase(createTodolistTC.rejected, (_state, action: any) => {
        console.log(action.payload.message)
      })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
      .addCase(changeTodolistTitleTC.rejected, (_state, action: any) => {
        console.log(action.payload.message!)
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex(({ id }) => id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
      .addCase(deleteTodolistTC.rejected, (_state, action: any) => {
        console.log(action.payload.message)
      })
  },
  selectors: {
    selectTodolists: (state) => state,
  },
})

/*export const fetchTodolistsTC = createAsyncThunk(
  `${todolistsSlice.name}/fetchTodolistsTC`,
  async (_, { rejectWithValue }) => {
    try {
      const res = await todolistsApi.getTodolists()
      return { todolists: res.data }
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)*/

export const createTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/createTodolistTC`,
  async (title: string, { rejectWithValue }) => {
    try {
      const res = await todolistsApi.createTodolist(title)
      const newTodolist = res.data.data.item
      return { todolist: newTodolist }
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const changeTodolistTitleTC = createAsyncThunk(
  `${todolistsSlice.name}/changeTodolistTitleTC`,
  async (
    args: {
      id: string
      title: string
    },
    { rejectWithValue },
  ) => {
    try {
      await todolistsApi.changeTodolistTitle(args)
      return args
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const deleteTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/deleteTodolistTC`,
  async (id: string, { rejectWithValue }) => {
    try {
      await todolistsApi.deleteTodolist(id)
      return { id }
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const { changeTodolistFilterAC, fetchTodolistsTC } = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors

export type DomainTodolists = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
