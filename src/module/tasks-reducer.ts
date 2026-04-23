import { Task, TasksState } from "../App.tsx"
import { v1 } from "uuid"
import { CreateTodolistAT, RemoveTodolistAT } from "./todolists-reducer.ts"

const initialState: TasksState = {}

export const tasksReducer = (state = initialState, action: ActionsTasks) => {
  switch (action.type) {
    case "todolists/ADD-TODOLIST": {
      const { newTodolistId } = action.payload
      return {
        ...state,
        [newTodolistId]: []
      }
    }
    case "tasks/REMOVE-TASK": {
      const { todoId, taskId } = action.payload
      return {
        ...state,
        [todoId]: state[todoId].filter(t => t.id !== taskId)
      }
    }
    case "tasks/CHANGE-TASK-TITLE": {
      const { todoId, taskId, title } = action.payload
      return {
        ...state,
        [todoId]: state[todoId].map(t => t.id === taskId ? { ...t, title } : t)
      }
    }
    case "tasks/CHANGE-TASK-STATUS": {
      const { todoId, taskId, isDone } = action.payload
      return {
        ...state,
        [todoId]: state[todoId].map(t => t.id === taskId ? { ...t, isDone } : t)
      }
    }
    case "tasks/CREATE-TASK": {
      const { todoId, title } = action.payload
      const newTask: Task = { id: v1(), title, isDone: false }
      return {
        ...state,
        [todoId]: [newTask, ...state[todoId]]
      }
    }
    case 'todolists/REMOVE-TODOLIST': {
      const copyState = {...state}
      delete copyState[action.payload.id]
      return copyState
    }
    default: {
      return state
    }
  }
}

export const removeTaskAC = (payload: { todoId: string, taskId: string }) => ({
  type: "tasks/REMOVE-TASK",
  payload
} as const)

export const createTaskAC = (payload: { todoId: string, title: string }) => ({
  type: "tasks/CREATE-TASK",
  payload
} as const)

export const changeTaskTitleAC = (payload: { todoId: string, taskId: string, title: string }) => ({
  type: "tasks/CHANGE-TASK-TITLE",
  payload
} as const)

export const changeTaskStatusAC = (payload: { todoId: string, taskId: string, isDone: boolean }) => ({
  type: "tasks/CHANGE-TASK-STATUS",
  payload
} as const)

type RemoveTaskAT = ReturnType<typeof removeTaskAC>
type CreateTaskAT = ReturnType<typeof createTaskAC>
type ChangeTasksStatusAT = ReturnType<typeof changeTaskStatusAC>
type ChangeTasksTitleAT = ReturnType<typeof changeTaskTitleAC>

type ActionsTasks =
  RemoveTaskAT
  | ChangeTasksStatusAT
  | ChangeTasksTitleAT
  | CreateTaskAT
  | CreateTodolistAT
  | RemoveTodolistAT