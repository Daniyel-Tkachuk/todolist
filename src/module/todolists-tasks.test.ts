import { beforeEach, test, expect } from "vitest"
import { TasksState, Todolist } from "../App.tsx"
import { v1 } from "uuid"
import { createTodolistAC, removeTodolistAC, todolistsReducer } from "./todolists-reducer.ts"
import { tasksReducer } from "./tasks-reducer.ts"

let todolistId1: string
let todolistId2: string


let todolists: Todolist[]
let tasks: TasksState

beforeEach(() => {
  todolistId1 = 'todolistId1'
  todolistId2 = 'todolistId2'

  todolists = [
    { id: todolistId1, title: "What to learn", filter: "all" },
    { id: todolistId2, title: "What to buy", filter: "all" }
  ]

  tasks = {
    [todolistId1]: [
      { id: v1(), title: "HTML&CSS", isDone: true },
      { id: v1(), title: "JS", isDone: true },
      { id: v1(), title: "ReactJS", isDone: false }
    ],
    [todolistId2]: [
      { id: v1(), title: "Rest API", isDone: true },
      { id: v1(), title: "GraphQL", isDone: false }
    ]
  }
})

test('correct todolist and task should be created', () => {
  const newTodolistId = v1()
  const title = 'New Todolist'

  const endTodolistsState = todolistsReducer(todolists, createTodolistAC({newTodolistId, title}))
  const endTasksState = tasksReducer(tasks, createTodolistAC({newTodolistId}))

  expect(endTodolistsState.length).toBe(3)
  expect(endTodolistsState[0].title).toBe(title)
  expect(endTodolistsState[0].id).toBe(newTodolistId)

  const keys = Object.keys(endTasksState)
  const newKey = keys.find(key => key !== todolistId1 && key !== todolistId2)
  if (!newKey) {
    throw new Error('New key should be added')
  }

  expect(keys.length).toBe(3)
  expect(endTasksState[newKey]).toEqual([])
})

test('correct todolist and task should be removed', () => {
  const todoId = todolistId2

  const endTodolistsState = todolistsReducer(todolists, removeTodolistAC(todoId))
  const endTasksState = tasksReducer(tasks, removeTodolistAC(todoId))

  expect(endTodolistsState.length).toBe(1)
  expect(endTodolistsState[0].title).toBe('What to learn')
  expect(endTodolistsState[0].id).toBe(todolistId1)

  const keys = Object.keys(endTasksState)

  expect(keys.length).toBe(1)
  expect(endTasksState[todolistId2]).toBeUndefined()
  expect(endTasksState[todolistId1]).toBeDefined()
})