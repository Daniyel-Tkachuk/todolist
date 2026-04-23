import { beforeEach, expect, test } from "vitest"
import { v1 } from "uuid"
import { FilterValues, Todolist } from "../App.tsx"
import {
  createTodolistAC,
  changeTodolistFilterAC,
  removeTodolistAC,
  todolistsReducer,
  updateTodolistTitleAC
} from "./todolists-reducer.ts"

let todolistId1: string
let todolistId2: string

let startState: Todolist[];

beforeEach(() => {
  todolistId1 = v1()
  todolistId2 = v1()

  startState = [
    {id: todolistId1, title: 'What to learn', filter: 'all'},
    {id: todolistId2, title: 'What to buy', filter: 'all'},
  ]
})

test('correct todolist should be removed', () => {
  const endState = todolistsReducer(startState, removeTodolistAC(todolistId1))

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
  expect(endState[0].title).toBe('What to buy')
})

test('correct todolist should be added', () => {
  const newTodolistTitle = 'Im new todolist'
  const newTodolistId = v1()

  const endState = todolistsReducer(startState, createTodolistAC({newTodolistId, title: newTodolistTitle}))

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(newTodolistTitle)
  expect(endState[0].id).toBe(newTodolistId)
  expect(endState[0].filter).toBe('all')
})

test('correct todolist should be changed title', () => {
  const newTodolistTitle = 'New TITLE'

  const endState = todolistsReducer(startState, updateTodolistTitleAC({title: newTodolistTitle, id: todolistId2}))

  expect(endState.length).toBe(2)
  expect(endState[0].title).toBe('What to learn')
  expect(endState[1].title).toBe(newTodolistTitle)
})


test('correct todolist should be changed filter', () => {
  const newFilterValue: FilterValues = 'active'

  const endState = todolistsReducer(startState, changeTodolistFilterAC({filter: newFilterValue, id: todolistId2}))

  expect(endState.length).toBe(2)
  expect(endState[0].filter).toBe('all')
  expect(endState[1].filter).toBe(newFilterValue)
})