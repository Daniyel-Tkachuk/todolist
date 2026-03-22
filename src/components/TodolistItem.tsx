import type { TasksState } from "../types.ts"
import { Button } from "./Button.tsx"
import type { FilterValues, Todolist } from "../App.tsx"
import { type ChangeEvent, useState, type KeyboardEvent } from "react"

type Props = {
  todolist: Todolist
  tasks: TasksState
  deleteTodolist: (todolistId: string) => void
  deleteTask: (todolistId: string, taskId: string) => void
  createTask: (todolistId: string, title: string) => void
  changeFilter: (todolistId: string, filter: FilterValues) => void
  changeTaskStatus: (todolistId: string, taskId: string, isDone: boolean) => void
}

export const TodolistItem = (props: Props) => {
  const {
    todolist,
    tasks,
    deleteTodolist,
    deleteTask,
    createTask,
    changeFilter,
    changeTaskStatus
  } = props

  const [taskTitle, setTaskTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  const deleteTodolistHandler = () => {
    deleteTodolist(todolist.id)
  }

  const changeTaskTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.currentTarget.value)
    setError(null)
  }

  const changeFilterHandler = (filter: FilterValues) => {
    changeFilter(todolist.id, filter)
  }

  const createTaskHandler = () => {
    const trimmedTitle = taskTitle.trim()
    if (trimmedTitle !== "") {
      createTask(todolist.id, trimmedTitle)
    } else {
      setError("Title is required")
    }
    setTaskTitle("")
  }

  const createTaskOnEnterHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      createTaskHandler()
    }
  }

  const deleteTaskHandler = (taskId: string) => {
    deleteTask(todolist.id, taskId)
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>, taskId: string) => {
    const taskStatus = e.currentTarget.checked
    changeTaskStatus(todolist.id, taskId, taskStatus)
  }

  const filteredTasks = tasks[todolist.id].filter(task => {
    if (todolist.filter === "active") return !task.isDone
    if (todolist.filter === "completed") return task.isDone
    return true
  })

  const mappedTask = filteredTasks.map((task) => (
    <li key={task.id} className={task.isDone ? "is-Done" : ""}>
      <Button title="X" onClick={() => deleteTaskHandler(task.id)} />
      <input type="checkbox" checked={task.isDone} onChange={(e) => changeTaskStatusHandler(e, task.id)} />
      <span>{task.title}</span>
    </li>
  ))

  return (
    <div>
      <div className={'container'}>
        <h3>{todolist.title}</h3>
        <Button title='X' onClick={deleteTodolistHandler}/>
      </div>
      <div>
        <input
          value={taskTitle}
          className={error ? "error" : ""}
          onChange={changeTaskTitleHandler}
          onKeyDown={createTaskOnEnterHandler}
        />
        <Button title="+" onClick={createTaskHandler} />
        {error && <div className="error-message">{error}</div>}
      </div>
      {
        tasks[todolist.id].length === 0
          ? <span>Your tasksList is empty</span>
          : <ul>{mappedTask}</ul>
      }
      <div>
        <Button
          title="All"
          onClick={() => changeFilterHandler("all")}
          className={todolist.filter === "all" ? "activeFilter" : ""}
        />
        <Button
          title="Active"
          className={todolist.filter === "active" ? "activeFilter" : ""}
          onClick={() => changeFilterHandler("active")}
        />
        <Button
          title="Completed"
          onClick={() => changeFilterHandler("completed")}
          className={todolist.filter === "completed" ? "activeFilter" : ""}
        />
      </div>
    </div>
  )
}
