import {test, expect, beforeEach} from "vitest";
import {
  changeTodolistFilterAC,
  createTodolistAC,
  removeTodolistAC,
  todolistReducer,
  updateTodolistAC
} from "./todolist-reducer.ts";
import {TodolistType} from "../../App.tsx";

const todolistId_1 = crypto.randomUUID()
const todolistId_2 = crypto.randomUUID()
let todolists: TodolistType[];

beforeEach(() => {
  todolists = [
    {id: todolistId_1, title: 'What to learn', filter: 'all'},
    {id: todolistId_2, title: 'What to buy', filter: 'all'},
  ]
})


test("correct todolist should be removed", () => {
  const endState = todolistReducer(todolists, removeTodolistAC(todolistId_2))

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId_1)
})
test("correct todolist should be added", () => {
  const newTitle = "New Todolist"
  const endState = todolistReducer(todolists, createTodolistAC(newTitle))

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(newTitle)
  expect(endState[1].id).toBe(todolistId_1)
  expect(endState[2].id).toBe(todolistId_2)
})
test("correct todolist should be updated title", () => {
  const endState = todolistReducer(todolists, updateTodolistAC(todolistId_2, "Проверка"))

  expect(endState.length).toBe(2);
  expect(endState[0].title).toBe("What to learn")
  expect(endState[1].title).toBe("Проверка")
  expect(endState[0].id).toBe(todolistId_1)
  expect(endState[1].id).toBe(todolistId_2)
})
test("correct filter of todolist should be changed", () => {
  const endState = todolistReducer(todolists, changeTodolistFilterAC(todolistId_1, "active"))

  expect(endState.length).toBe(2);
  expect(endState[0].filter).toBe("active")
  expect(endState[1].filter).toBe("all")
})