import {CreateTodolistAT, RemoveTodolistAT} from "../todolistReducer/todolist-reducer.ts";

export type TaskType = {
  id: string
  title: string
  isDone: boolean
}

export type TasksStateType = {
  [key: string]: TaskType[]
}


const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: ActionsType): TasksStateType => {
  switch (action.type) {
    case "todolist/createTodolist": {
      return {
        [action.payload.todoId]: [],
        ...state,
      }
    }
    case "todolist/removeTodolist": {
      const {[action.payload.id]: _, ...rest} = state
      return rest
    }
    case "tasks/deleteTask": {
      const {todoId, taskId} = action.payload
      return {
        ...state,
        [todoId]: state[todoId].filter(t => t.id !== taskId)
      }
    }
    case "tasks/createTaskAC": {
      const {todoId} = action.payload

      const newTask: TaskType = {
        id: crypto.randomUUID(),
        title: action.payload.title,
        isDone: false
      }
      return {
        ...state,
        [todoId]: [newTask, ...state[todoId]]
      }
    }
    case "tasks/changeTaskStatus": {
      const {todoId, taskId, isDone} = action.payload
      return {
        ...state,
        [todoId]: state[todoId].map(t => t.id === taskId ? {...t, isDone} : t)
      }
    }
    case "tasks/updateTaskTitle": {
      const {todoId, taskId, title} = action.payload
      return {
        ...state,
        [todoId]: state[todoId].map(t => t.id === taskId ? {...t, title} : t)
      }
    }
    case "tasks/deleteAllTasks": {
      return {
        ...state,
        [action.payload.todoId]: []
      }
    }
    default: {
      return state
    }
  }
}

export const deleteTaskAC = (todoId: string, taskId: string) => ({
  type: "tasks/deleteTask",
  payload: {
    todoId,
    taskId
  }
} as const)
export const createTaskAC = (todoId: string, title: string) => ({
  type: "tasks/createTaskAC",
  payload: {
    todoId,
    title
  }
} as const)
export const changeTaskStatusAC = (todoId: string, taskId: string, isDone: boolean) => ({
  type: "tasks/changeTaskStatus",
  payload: {
    todoId,
    taskId,
    isDone
  }
} as const)
export const updateTaskTitleAC = (todoId: string, taskId: string, title: string) => ({
  type: "tasks/updateTaskTitle",
  payload: {
    todoId,
    taskId,
    title
  }
} as const)
export const deleteAllTasksAC = (todoId: string) => ({
  type: "tasks/deleteAllTasks",
  payload: {
    todoId
  }
} as const)

type DeleteTaskAT = ReturnType<typeof deleteTaskAC>
type CreateTaskAT = ReturnType<typeof createTaskAC>
type ChangeTaskStatusAT = ReturnType<typeof changeTaskStatusAC>
type UpdateTaskTitleAT = ReturnType<typeof updateTaskTitleAC>
type DeleteAllTasksAT = ReturnType<typeof deleteAllTasksAC>

type ActionsType = DeleteTaskAT
  | CreateTaskAT
  | ChangeTaskStatusAT
  | UpdateTaskTitleAT
  | DeleteAllTasksAT
  | CreateTodolistAT
  | RemoveTodolistAT