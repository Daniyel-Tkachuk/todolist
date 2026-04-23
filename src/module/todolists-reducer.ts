import { FilterValues, Todolist } from "../App.tsx"


export const todolistsReducer = (state: Todolist[], action: ActionsTodolists): Todolist[] => {
  switch (action.type) {
    case 'todolists/REMOVE-TODOLIST': {
      return state.filter(tl => tl.id !== action.payload.id)
    }
    case 'todolists/ADD-TODOLIST': {
      const {newTodolistId, title} = action.payload
      const newTodolist: Todolist = {id: newTodolistId, title: title || '', filter: 'all'}
      return [newTodolist, ...state]
    }
    case 'todolists/UPDATE-TODOLIST-TITLE': {
      const {title, id} = action.payload
      return state.map(tl => tl.id === id ? {...tl, title} : tl)
    }
    case 'todolists/CHANGE-TODOLIST-FILTER': {
      const {id, filter} = action.payload
      return state.map(tl => tl.id === id ? {...tl, filter} : tl)
    }
    default: {
      return state
    }
  }
}

export const removeTodolistAC = (id: string) => ({
  type: 'todolists/REMOVE-TODOLIST',
  payload: {
    id
  }
} as const)

export const createTodolistAC = (payload: {newTodolistId: string, title?: string}) => ({
  type: 'todolists/ADD-TODOLIST',
  payload,
} as const)

export const updateTodolistTitleAC = (payload: {id: string, title: string}) => ({
  type: 'todolists/UPDATE-TODOLIST-TITLE',
  payload
} as const)

export const changeTodolistFilterAC = (payload: {id: string, filter: FilterValues}) => ({
  type: 'todolists/CHANGE-TODOLIST-FILTER',
  payload
} as const)

export type RemoveTodolistAT = ReturnType<typeof removeTodolistAC>
export type CreateTodolistAT = ReturnType<typeof createTodolistAC>
type UpdateTodolistTitleAT = ReturnType<typeof updateTodolistTitleAC>
type ChangeTodolistFilterAT = ReturnType<typeof changeTodolistFilterAC>

type ActionsTodolists = RemoveTodolistAT | CreateTodolistAT | UpdateTodolistTitleAT | ChangeTodolistFilterAT