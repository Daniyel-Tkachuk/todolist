import { beforeEach, expect, test } from "vitest"
import { createTaskTC, deleteTaskTC, tasksReducer, type TasksState, updateTaskTC } from "../tasksSlice.ts"
import { TaskPriority, TaskStatus } from "@/common/enums"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { createTodolistTC, deleteTodolistTC } from "@/features/todolists/model/todolistsSlice.ts"
import { nanoid } from "@reduxjs/toolkit"

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
  const payload = {
    todolistId: "todolistId2",
    taskId: "2",
  }
  const args = { ...payload }

  const endState = tasksReducer(startState, deleteTaskTC.fulfilled(payload, "requestId", args))

  expect(endState.todolistId2.length).toBe(2)
  expect(endState.todolistId2[1].id).toBe("3")
  expect(endState.todolistId2[1].title).toBe("tea")
  expect(endState.todolistId1.length).toBe(3)
})

test("correct task should be created at correct array", () => {
  //new task
  const payload: DomainTask = {
    id: "555",
    title: "new task!!!",
    status: TaskStatus.New,
    todoListId: "todolistId2",
    ...taskDefaultValues,
  }

  const endState = tasksReducer(
    startState,
    createTaskTC.fulfilled(payload, "requestId", { todolistId: "todolistId2", title: "new task!!!" }),
  )

  expect(endState.todolistId1.length).toBe(3)
  expect(endState.todolistId2.length).toBe(4)
  expect(endState.todolistId2[0].id).toBe(payload.id)
  expect(endState.todolistId2[0].title).toBe(payload.title)
  expect(endState.todolistId2[0].status).toBe(payload.status)
})

test("correct task should change its status", () => {
  const args = {
    todolistId: "todolistId2",
    taskId: "2",
    model: { status: 0 },
  } as { todolistId: string; taskId: string; model: Partial<UpdateTaskModel> }

  const updatedTask = {
    id: "2",
    title: "milk",
    status: TaskStatus.New,
    todoListId: "todolistId2",
    ...taskDefaultValues,
  }

  const endState = tasksReducer(startState, updateTaskTC.fulfilled(updatedTask, "requestId", args))

  expect(endState.todolistId1.length).toBe(3)
  expect(endState.todolistId2.length).toBe(3)
  expect(endState.todolistId2[1].status).toBe(TaskStatus.New)
  expect(endState.todolistId1[1].status).toBe(TaskStatus.Completed)

})

test("correct task should change its title", () => {
  const args = {
    todolistId: "todolistId2",
    taskId: "2",
    model: { title: "updated task!!!" },
  } as { todolistId: string; taskId: string; model: Partial<UpdateTaskModel> }

  const updatedTask = {
    id: "2",
    title: "updated task!!!",
    status: TaskStatus.Completed,
    todoListId: "todolistId2",
    ...taskDefaultValues,
  }

  const endState = tasksReducer(
    startState,
    updateTaskTC.fulfilled(updatedTask, "requestId", args),
  )

  expect(endState.todolistId1.length).toBe(3)
  expect(endState.todolistId2.length).toBe(3)
  expect(endState.todolistId2[1].title).toBe(updatedTask.title)
  expect(endState.todolistId1[1].title).toBe("JS")
})

test("array should be created for new todolist", () => {
  const todolistId = nanoid()
  const newTodolist = {
    id: todolistId,
    title: "New todolist",
    addedDate: "",
    order: 0
  }
  
  const endState = tasksReducer(startState, createTodolistTC.fulfilled({ newTodolist }, "requestId", newTodolist.title))

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2")
  if (!newKey) {
    throw Error("New key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test("property with todolistId should be deleted", () => {
  const endState = tasksReducer(startState, deleteTodolistTC.fulfilled({todoId: 'todolistId2'}, 'requestId', 'todolistId2'))

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState['todolistId1'].length).toBe(3)
  expect(endState["todolistId2"]).not.toBeDefined() // свойства нет ВООБЩЕ !!!!

  // or
  expect(endState["todolistId2"]).toBeUndefined() // свойство может быть, но значение должно быть undefined
})
