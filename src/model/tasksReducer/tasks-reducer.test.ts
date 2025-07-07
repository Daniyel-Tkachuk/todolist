import {beforeEach, test, expect} from "vitest";
import {TasksStateType} from "../../App.tsx";
import {changeTaskStatusAC, createTaskAC, deleteTaskAC, tasksReducer, updateTaskTitleAC} from "./tasks-reducer.ts";

const todolistId_1 = crypto.randomUUID()
const todolistId_2 = crypto.randomUUID()

let startState: TasksStateType;

beforeEach(() => {
  startState = {
    [todolistId_1]: [
      {id: "12", title: 'HTML&CSS', isDone: true},
      {id: "17", title: 'JS', isDone: true},
      {id: "20", title: 'ReactJS', isDone: false},
    ],
    [todolistId_2]: [
      {id: "3", title: 'Rest API', isDone: true},
      {id: "1", title: 'GraphQL', isDone: false},
    ],
  }
})

test("correct task should be removed", () => {
  const endState = tasksReducer(startState, deleteTaskAC(todolistId_1, "17"))

  expect(endState[todolistId_1].length).toBe(2)
  expect(endState[todolistId_1][0].title).toBe('HTML&CSS')
  expect(endState[todolistId_1][1].title).toBe('ReactJS')
})
test("correct task should be added", () => {
  const endState = tasksReducer(startState, createTaskAC(todolistId_2, "New task!"))

  expect(endState[todolistId_2].length).toBe(3)
  expect(endState[todolistId_2][0].title).toBe('New task!')
  expect(endState[todolistId_2][1].title).toBe('Rest API')
  expect(endState[todolistId_2][2].title).toBe('GraphQL')
  expect(endState[todolistId_1].length).toBe(3)
})
test("correct status (isDone) of task should be changed", () => {
  const endState = tasksReducer(startState, changeTaskStatusAC(todolistId_2, "1", true))

  expect(endState[todolistId_2].length).toBe(2)
  expect(endState[todolistId_1].length).toBe(3)
  expect(endState[todolistId_2][1].isDone).toBeTruthy()
  expect(endState[todolistId_2][0].isDone).toBeTruthy()
})
test("correct title of task should be updated", () => {
  const endState = tasksReducer(startState, updateTaskTitleAC(todolistId_2, "1", "Новый заголовок"))

  expect(endState[todolistId_2].length).toBe(2)
  expect(endState[todolistId_1].length).toBe(3)
  expect(endState[todolistId_2][1].title).toBe("Новый заголовок")
  expect(endState[todolistId_2][0].title).toBe("Rest API")
})