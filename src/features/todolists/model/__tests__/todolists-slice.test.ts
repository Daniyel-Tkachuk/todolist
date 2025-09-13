import { nanoid } from "@reduxjs/toolkit"
import { beforeEach, expect, test } from "vitest"
import {
  deleteTodolistTC,
  createTodolistTC,
  type DomainTodolists,
  todolistsReducer,
  changeTodolistTitleTC, changeTodolistFilterAC
} from "../todolistsSlice.ts"

let todolistId1: string
let todolistId2: string
let startState: DomainTodolists[] = []

beforeEach(() => {
  todolistId1 = nanoid()
  todolistId2 = nanoid()

  startState = [
    { id: todolistId1, title: "What to learn", addedDate: "", order: 0, filter: "all" },
    { id: todolistId2, title: "What to buy", addedDate: "", order: 0, filter: "all" },
  ]
})

test("correct todolist should be deleted", () => {
  const endState = todolistsReducer(startState, deleteTodolistTC.fulfilled({todoId: todolistId1}, 'requestId', todolistId1))

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test("correct todolist should be created", () => {
  const newTodolist = {
    id: "3",
    title: "New todolist",
    addedDate: "",
    order: 0
  }
  const endState = todolistsReducer(startState, createTodolistTC.fulfilled({newTodolist}, 'requestId', newTodolist.title))

  expect(endState.length).toBe(3)
  expect(endState[2].title).toBe(newTodolist.title)
  expect(endState[2].filter).toBe("all")
})

test("correct todolist should change its title", () => {
  const args = {
    id: todolistId2,
    title: "New title",
  }
  const endState = todolistsReducer(startState, changeTodolistTitleTC.fulfilled(args, 'requestId', args))

  expect(endState.length).toBe(2)
  expect(endState[0].title).toBe("What to learn")
  expect(endState[1].title).toBe("New title")
})

test("correct todolist should change its filter", () => {
  const filter = "completed"
  const endState = todolistsReducer(startState, changeTodolistFilterAC({ id: todolistId2, filter }))

  expect(endState[0].filter).toBe("all")
  expect(endState[1].filter).toBe(filter)
})
