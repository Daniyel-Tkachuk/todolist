import {beforeEach, test, expect} from "vitest";
import {TasksStateType, TodolistType} from "../App.tsx";
import {createTodolistAC, removeTodolistAC, todolistReducer} from "./todolistReducer/todolist-reducer.ts";
import {tasksReducer} from "./tasksReducer/tasks-reducer.ts";

const todolistId_1 = crypto.randomUUID()
const todolistId_2 = crypto.randomUUID()

let startTodolistsState: TodolistType[];
let startTasksState: TasksStateType;

beforeEach(() => {
  startTodolistsState = [
    {id: todolistId_1, title: 'What to learn', filter: 'all'},
    {id: todolistId_2, title: 'What to buy', filter: 'all'},
  ]

  startTasksState = {
    [todolistId_1]: [
      {id: crypto.randomUUID(), title: 'HTML&CSS', isDone: true},
      {id: crypto.randomUUID(), title: 'JS', isDone: true},
      {id: crypto.randomUUID(), title: 'ReactJS', isDone: false},
    ],
    [todolistId_2]: [
      {id: crypto.randomUUID(), title: 'Rest API', isDone: true},
      {id: crypto.randomUUID(), title: 'GraphQL', isDone: false},
    ],
  }
})

test("correct todolist should be removed in both states", () => {
  const endTodolistsState = todolistReducer(startTodolistsState, removeTodolistAC(todolistId_1))
  const endTasksState = tasksReducer(startTasksState, removeTodolistAC(todolistId_1))

  const keys = Object.keys(endTasksState)

  expect(endTodolistsState.length).toBe(1);
  expect(keys.length).toBe(1);
  expect(keys[0]).toBe(todolistId_2);
  expect(endTasksState[todolistId_2]).toBeDefined();
})

test("correct todolist should be added and in both states", () => {
  const newTodoId = crypto.randomUUID();
  const newTitleTodo = "Новый Тудулист";

  const endTodolistsState = todolistReducer(startTodolistsState, createTodolistAC(newTodoId, newTitleTodo))
  const endTasksState = tasksReducer(startTasksState, createTodolistAC(newTodoId, newTitleTodo))

  expect(endTodolistsState.length).toBe(3)
  expect(endTodolistsState[0].title).toBe(newTitleTodo)
  expect(endTodolistsState[1].title).toBe('What to learn')

  const keys = Object.keys(endTasksState);
  expect(keys.length).toBe(3)
  expect(keys[0]).toBe(newTodoId)
  expect(endTasksState[keys[0]].length).toBe(0)
  expect(keys[1]).toBe(todolistId_1)
  expect(keys[2]).toBe(todolistId_2)
})