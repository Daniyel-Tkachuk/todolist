import {beforeEach, expect, test} from "vitest"
import {createTaskTC, deleteTaskTC, tasksReducer, TasksState, updateTaskTC} from "../tasks-slice.ts"
import {createTodolistTC, deleteTodolistTC} from "../todolists-slice.ts"
import {TaskPriority, TaskStatus} from "@/common/enums"
import type {DomainTask} from "@/features/todolists/api/tasksApi.types"

let startState: TasksState = {}

const taskDefaultValues = {
  description: "",
  deadline: "",
  addedDate: "",
  startDate: "",
  priority: TaskPriority.Low,
  order: 0,
}

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatus.Completed,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatus.Completed,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
    ],
  }
})

test("correct task should be deleted", () => {
  const args = {todolistId: "todolistId2", taskId: "2"}

  const endState = tasksReducer(startState, deleteTaskTC.fulfilled(args, "requestId", args))

  expect(endState).toEqual({
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatus.Completed,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
    ],
  })
})

test("correct task should be created at correct array", () => {
  const newTitle = "new task"

  const newTask: DomainTask = {
    id: "4",
    title: newTitle,
    status: TaskStatus.New,
    todoListId: "todolistId2",
    ...taskDefaultValues,
  }

  const endState = tasksReducer(
    startState,
    createTaskTC.fulfilled({newTask}, "requestId", {todolistId: "todolistId2", title: newTitle}),
  )

  expect(endState.todolistId1.length).toBe(3)
  expect(endState.todolistId2.length).toBe(4)
  expect(endState.todolistId2[0].id).toBeDefined()
  expect(endState.todolistId2[0].id).toBe("4")
  expect(endState.todolistId2[0].title).toBe(newTitle)
  expect(endState.todolistId2[0].status).toBe(0)
})

test("correct task should change its status", () => {
  const updatedTask = {
    id: "2",
    title: "milk",
    status: TaskStatus.New,
    todoListId: "todolistId2",
    ...taskDefaultValues,
  }

  const endState = tasksReducer(
    startState,
    updateTaskTC.fulfilled({updatedTask}, "requestId", {
      todolistId: "todolistId2",
      taskId: "2",
      model: {status: TaskStatus.New},
    }),
  )

  expect(endState.todolistId2[1].status).toBe(0)
  expect(endState.todolistId2[1].title).toBe("milk")
})

test("correct task should change its title", () => {
  const newTitle = "tomatoes"

  const updatedTask = {
    id: "2",
    title: newTitle,
    status: TaskStatus.Completed,
    todoListId: "todolistId2",
    ...taskDefaultValues,
  }

  const endState = tasksReducer(
    startState,
    updateTaskTC.fulfilled({updatedTask}, "requestId", {
      todolistId: "todolistId2",
      taskId: "2",
      model: {title: newTitle},
    }),
  )

  expect(endState.todolistId2.length).toBe(3)
  expect(endState.todolistId2[1].status).toBe(2)
  expect(endState.todolistId2[1].title).toBe(newTitle)
})

test("array should be created for new todolist", () => {
  const newTodolistTitle = "new todolist"
  const newTodolist = {id: "new_todolist_2026_06_20", title: newTodolistTitle, addedDate: "", order: 0}

  const endState = tasksReducer(
    startState,
    createTodolistTC.fulfilled({todolist: newTodolist}, "requestId", newTodolistTitle),
  )

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2")
  if (!newKey) {
    throw Error("New key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
  expect(endState[newKey].length).toEqual(0)
})

test("property with todolistId should be deleted", () => {
  const endState = tasksReducer(startState, deleteTodolistTC.fulfilled({id: "todolistId2"}, "requestId", "todolistId2"))

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).not.toBeDefined()
  // or
  expect(endState["todolistId2"]).toBeUndefined()
})
