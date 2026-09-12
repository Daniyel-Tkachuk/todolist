import {beforeEach, expect, test} from "vitest"
import {createTaskTC, deleteTaskTC, tasksReducer, type TasksState, updateTaskTC} from "../tasks-slice"
import {TaskPriority, TaskStatus} from "@/common/enums"
import type {DomainTask} from "@/features/todolists/api/tasksApi.types"
import {createTodolistTC, deleteTodolistTC} from "@/features/todolists/model/todolists-slice"
import type {Todolist} from "@/features/todolists/api/todolistsApi.types"

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
  const endState = tasksReducer(
    startState,
    deleteTaskTC.fulfilled({todolistId: "todolistId2", taskId: "2"}, "requestId", {
      todolistId: "todolistId1",
      taskId: "2",
    }),
  )

  /*expect(endState).toEqual({
    todolistId1: [
      {id: "1", title: "CSS", isDone: false},
      {id: "2", title: "JS", isDone: true},
      {id: "3", title: "React", isDone: false},
    ],
    todolistId2: [
      {id: "1", title: "bread", isDone: false},
      {id: "3", title: "tea", isDone: false},
    ],
  })*/

  expect(endState["todolistId1"].length).toBe(3)
  expect(endState["todolistId2"].length).toBe(2)
  expect(endState["todolistId2"][0].title).toBe("bread")
  expect(endState["todolistId2"][1].title).toBe("tea")
})

test("correct task should be created at correct array", () => {
  const title = "new task!!!"

  const newTask: DomainTask = {
    id: "4-new",
    title,
    status: TaskStatus.New,
    todoListId: "todolistId2",
    ...taskDefaultValues,
  }

  const endState = tasksReducer(
    startState,
    createTaskTC.fulfilled({task: newTask}, "requestId", {todolistId: "todolistId2", title}),
  )

  expect(endState.todolistId1.length).toBe(3)
  expect(endState.todolistId2.length).toBe(4)
  expect(endState.todolistId2[0].id).toBeDefined()
  expect(endState.todolistId2[0].title).toBe(title)
  expect(endState.todolistId2[0].status).toBe(TaskStatus.New)
  expect(endState.todolistId2[0].todoListId).toBe("todolistId2")
})

test("correct task should change its status", () => {
  const newTask: DomainTask = {
    id: "2",
    title: "JS",
    status: TaskStatus.New,
    todoListId: "todolistId1",
    ...taskDefaultValues,
  }

  const endState = tasksReducer(
    startState,
    updateTaskTC.fulfilled({task: newTask}, "requestId", {
      todolistId: "todolistId1",
      taskId: "2",
      domainModel: {status: TaskStatus.New},
    }),
  )

  expect(endState.todolistId2[1].status).toBe(TaskStatus.Completed)
  expect(endState.todolistId1[1].status).toBe(TaskStatus.New)
})

test("correct task should change its title", () => {
  const newTitle = "new title !"

  const newTask: DomainTask = {
    id: "2",
    title: newTitle,
    status: TaskStatus.Completed,
    todoListId: "todolistId1",
    ...taskDefaultValues,
  }

  const endState = tasksReducer(
    startState,
    updateTaskTC.fulfilled({task: newTask}, "requestId", {
      todolistId: "todolistId1",
      taskId: "2",
      domainModel: {title: newTitle},
    }),
  )

  expect(endState.todolistId2[1].title).toBe("milk")
  expect(endState.todolistId1[1].title).toBe(newTitle)
})

test("array should be created for new todolist", () => {
  const title = "New todolist"
  const newTodolist: Todolist = {
    id: "todolist3",
    title,
    order: 0,
    addedDate: "",
  }

  const endState = tasksReducer(startState, createTodolistTC.fulfilled({todolist: newTodolist}, "requestId", {title}))

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2")
  if (!newKey) {
    throw Error("New key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test("property with todolistId should be deleted", () => {
  const todolistId = "todolistId2"

  const endState = tasksReducer(startState, deleteTodolistTC.fulfilled({id: todolistId}, "requestId", todolistId))

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).not.toBeDefined()
  // or
  expect(endState["todolistId2"]).toBeUndefined()
})
