import {FilterValues, TodolistType} from "../../App.tsx";

const todolistId_1 = crypto.randomUUID()
const todolistId_2 = crypto.randomUUID()

const initialState: TodolistType[] = [
  {id: todolistId_1, title: 'What to learn', filter: 'all'},
  {id: todolistId_2, title: 'What to buy', filter: 'all'},
]

export const todolistReducer = (state = initialState, action: ActionsType): TodolistType[] => {
  switch (action.type) {
    case "todolist/removeTodolist": {
      return state.filter(tl => tl.id !== action.payload.id)
    }
    case "todolist/createTodolist": {
      const newTodolist: TodolistType = {
        id: crypto.randomUUID(),
        title: action.payload.title,
        filter: "all"
      }
      return [newTodolist, ...state]
    }
    case "todolist/updateTodolist": {
      const {id, title} = action.payload
      return state.map(tl => tl.id === id ? {...tl, title} : tl)
    }
    case "todolist/changeTodolistFilter": {
      const {id, filter} = action.payload
      return state.map(tl => tl.id === id ? {...tl, filter} : tl)
    }
    default: {
      return state
    }
  }
}

export const removeTodolistAC = (id: string) => ({
  type: "todolist/removeTodolist",
  payload: {
    id
  }
} as const)
export const createTodolistAC = (title: string) => ({
  type: "todolist/createTodolist",
  payload: {
    title
  }
} as const)
export const updateTodolistAC = (id: string, title: string) => ({
  type: "todolist/updateTodolist",
  payload: {
    id,
    title
  }
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValues) => ({
  type: "todolist/changeTodolistFilter",
  payload: {
    id,
    filter
  }
} as const)


type RemoveTodolistAT = ReturnType<typeof removeTodolistAC>
type CreateTodolistAT = ReturnType<typeof createTodolistAC>
type UpdateTodolistAT = ReturnType<typeof updateTodolistAC>
type ChangeTodolistFilterAT = ReturnType<typeof changeTodolistFilterAC>


type ActionsType = RemoveTodolistAT
  | CreateTodolistAT
  | UpdateTodolistAT
  | ChangeTodolistFilterAT