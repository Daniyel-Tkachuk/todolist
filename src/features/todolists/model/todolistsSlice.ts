import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { createAppSlice } from "@/common/utils"
import { changeAppStatusAC, RequestStatus } from "@/app/appSlice.ts"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolists[],
  reducers: (create) => ({
    fetchTodolistsTC: create.asyncThunk(
      async (_arg, { rejectWithValue, dispatch }) => {
        try {
          dispatch(changeAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.getTodolists()
          return { todolists: res.data }
        } catch (error) {
          dispatch(changeAppStatusAC({ status: "failed" }))
          return rejectWithValue(error)
        } finally {
          dispatch(changeAppStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (_state, action) =>
          action.payload.todolists.map((todolist) => ({
            ...todolist,
            entityStatus: "idle",
            filter: "all",
          })),
        rejected: (_state, action: any) => {
          console.log(action.payload.message)
        },
      },
    ),
    deleteTodolistTC: create.asyncThunk(
      async (todoId: string, { rejectWithValue, dispatch }) => {
        try {
          dispatch(changeAppStatusAC({ status: "loading" }))
          dispatch(changeTodolistStatusAC({id: todoId, entityStatus: "loading"}))
          await todolistsApi.deleteTodolist(todoId)
          return { todoId }
        } catch (e) {
          dispatch(changeAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        } finally {
          dispatch(changeAppStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.todoId)
          if (index !== -1) {
            state.splice(index, 1)
          }
        },
        rejected: (_state, action: any) => {
          console.log(action.payload.message)
        },
      },
    ),
    createTodolistTC: create.asyncThunk(
      async (title: string, { rejectWithValue, dispatch }) => {
        try {
          dispatch(changeAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.createTodolist(title)
          return { newTodolist: res.data.data.item }
        } catch (e) {
          dispatch(changeAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        } finally {
          dispatch(changeAppStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (state, action) => {
          state.push({ ...action.payload.newTodolist, entityStatus: "idle", filter: "all" })
        },
        rejected: (_state, action: any) => {
          console.log(action.payload.message)
        },
      },
    ),
    changeTodolistTitleTC: create.asyncThunk(
      async (args: { id: string; title: string }, { rejectWithValue, dispatch }) => {
        try {
          dispatch(changeAppStatusAC({ status: "loading" }))
          await todolistsApi.changeTodolistTitle(args)
          return args
        } catch (e) {
          dispatch(changeAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        } finally {
          dispatch(changeAppStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (state, action) => {
          const { id, title } = action.payload
          const index = state.findIndex((todolist) => todolist.id === id)
          if (index !== -1) {
            state[index].title = title
          }
        },
        rejected: (_state, action: any) => {
          console.log(action.payload.message)
        },
      },
    ),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index !== -1) {
        state[index].filter = action.payload.filter
      }
    }),
    changeTodolistStatusAC: create.reducer<{ id: string; entityStatus: RequestStatus }>((state, action) => {
      const { id, entityStatus } = action.payload
      const index = state.findIndex((tl) => tl.id === id)
      if (index !== -1) {
        state[index].entityStatus = entityStatus
      }
    }),
  }),
  // Памятка: **** санки для RTK *****
  /* extraReducers: (builder) => {
     builder
       .addCase(fetchTodolistsTC.fulfilled, (_state, action) => {
         return action.payload.todolists.map((todolist) => {
           return { ...todolist, filter: "all" }
         })
       })
       .addCase(fetchTodolistsTC.rejected, (_state, action: any) => {
         console.log(action.payload.message)
       })
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
   },*/
  selectors: {
    selectTodolists: (state) => state,
  },
})

// ******* Памятка: санки для RTK *******
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
/*export const createTodolistTC = createAsyncThunk(
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
)*/
/*export const changeTodolistTitleTC = createAsyncThunk(
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
)*/
/*export const deleteTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/deleteTodolistTC`,
  async (id: string, { rejectWithValue }) => {
    try {
      await todolistsApi.deleteTodolist(id)
      return { id }
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)*/

export const { changeTodolistFilterAC, changeTodolistStatusAC, fetchTodolistsTC, deleteTodolistTC, createTodolistTC, changeTodolistTitleTC } =
  todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors

export type DomainTodolists = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}

export type FilterValues = "all" | "active" | "completed"
