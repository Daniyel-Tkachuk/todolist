import { beforeEach, expect, test } from "vitest"
import { TasksState } from "../App.tsx"
import { changeTaskStatusAC, changeTaskTitleAC, createTaskAC, removeTaskAC, tasksReducer } from "./tasks-reducer.ts"
import { createTodolistAC, removeTodolistAC } from "./todolists-reducer.ts"
import { v1 } from "uuid"

let startState: TasksState = {}

beforeEach(() => {
  startState = {
    todolistId1: [
      { id: '1', title: 'CSS', isDone: false },
      { id: '2', title: 'JS', isDone: true },
      { id: '3', title: 'React', isDone: false },
    ],
    todolistId2: [
      { id: '1', title: 'bread', isDone: false },
      { id: '2', title: 'milk', isDone: true },
      { id: '3', title: 'tea', isDone: false },
    ],
  }
})

test('correct task should be removed', () => {
  const endState = tasksReducer(startState, removeTaskAC({todoId: 'todolistId2', taskId: '2'}))

  expect(endState['todolistId2'].length).toBe(2)
  expect(endState['todolistId2'][0].title).toBe('bread')
  expect(endState['todolistId2'][1].title).toBe('tea')
  expect(endState['todolistId1'].length).toBe(3)
})

test('correct task should be creating', () => {
  const newTaskTitle = 'New Task'

  const endState = tasksReducer(startState, createTaskAC({todoId: 'todolistId2', title: newTaskTitle}))

  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(4)
  expect(endState['todolistId2'][0].title).toBe(newTaskTitle)
})

test('correct title for task should be changed', () => {
  const newTaskTitle = 'New Task Title'
  const endState = tasksReducer(startState, changeTaskTitleAC({todoId: 'todolistId1', taskId: '2', title: newTaskTitle}))

  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId1'][1].title).toBe(newTaskTitle)
})

test('correct status for task should be changed', () => {
  const endState = tasksReducer(startState, changeTaskStatusAC({todoId: 'todolistId1', taskId: '2', isDone: false}))

  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId1'][1].isDone).toBe(false)
  expect(endState['todolistId1'][0].isDone).toBe(false)
  expect(endState['todolistId1'][2].isDone).toBe(false)
})

test('correct task should be creating', () => {
  const id = v1()

  const endState = tasksReducer(startState, createTodolistAC({newTodolistId: id}))

  const keys = Object.keys(endState)
  const newKey = keys.find(k => k !== 'todolistId1' && k !== 'todolistId2')

  expect(keys.length).toBe(3)
  expect(newKey).toBe(id)
  expect(endState[id]).toBeDefined()
})

test('correct task should be removed', () => {
  const endState = tasksReducer(startState, removeTodolistAC('todolistId2'))

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState[keys[0]].length).toBe(3)
  expect(endState[keys[0]][1].title).toBe('JS')
  expect(endState['todolistId2']).toBeUndefined()
})