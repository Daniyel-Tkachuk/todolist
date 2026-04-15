import type { TasksState } from "../types.ts"
import type { FilterValues, Todolist } from "../App.tsx"
import { type ChangeEvent } from "react"
import { AddItemForm } from "@/components/AddItemForm.tsx"
import { EditableSpan } from "@/components/EditableSpan.tsx"
import { Button, IconButton, ListItem, Checkbox, List, Box } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import { filterButtonsBox, getListItemSx } from "@/components/Todolist.styles.ts"

type Props = {
  todolist: Todolist
  tasks: TasksState
  deleteTodolist: (todolistId: string) => void
  deleteTask: (todolistId: string, taskId: string) => void
  createTask: (todolistId: string, title: string) => void
  changeFilter: (todolistId: string, filter: FilterValues) => void
  changeTaskStatus: (todolistId: string, taskId: string, isDone: boolean) => void
  updateTaskTitle: (todolistId: string, taskId: string, title: string) => void
  updateTodolistTitle: (todolistId: string, title: string) => void
}

export const TodolistItem = (props: Props) => {
  const {
    todolist,
    tasks,
    deleteTodolist,
    deleteTask,
    createTask,
    changeFilter,
    changeTaskStatus,
    updateTaskTitle,
    updateTodolistTitle
  } = props

  const deleteTodolistHandler = () => {
    deleteTodolist(todolist.id)
  }

  const changeFilterHandler = (filter: FilterValues) => {
    changeFilter(todolist.id, filter)
  }

  const deleteTaskHandler = (taskId: string) => {
    deleteTask(todolist.id, taskId)
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>, taskId: string) => {
    const taskStatus = e.currentTarget.checked
    changeTaskStatus(todolist.id, taskId, taskStatus)
  }

  const createTaskHandler = (title: string) => {
    createTask(todolist.id, title)
  }

  const updateTaskTitleHandler = (taskId: string, title: string) => {
    updateTaskTitle(todolist.id, taskId, title)
  }

  const updateTodolistTitleHandler = (title: string) => {
    updateTodolistTitle(todolist.id, title)
  }

  const filteredTasks = tasks[todolist.id].filter(task => {
    if (todolist.filter === "active") return !task.isDone
    if (todolist.filter === "completed") return task.isDone
    return true
  })

  const mappedTask = filteredTasks.map((task) => (
    <ListItem key={task.id} sx={getListItemSx(task.isDone)}>
      <div>
        <Checkbox checked={task.isDone} onChange={(e) => changeTaskStatusHandler(e, task.id)} />
        <EditableSpan
          title={task.title}
          setTitle={(title: string) => updateTaskTitleHandler(task.id, title)}
        />
      </div>
      <IconButton aria-label="delete" onClick={() => deleteTaskHandler(task.id)}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  ))

  return (
    <div>
      <div className={"container"}>
        <h3>
          <EditableSpan title={todolist.title} setTitle={updateTodolistTitleHandler} />
          <IconButton aria-label="delete" onClick={deleteTodolistHandler}>
            <DeleteIcon />
          </IconButton>
        </h3>
      </div>

      <AddItemForm addItem={createTaskHandler} />

      {
        tasks[todolist.id].length === 0
          ? <span>Your tasksList is empty</span>
          : <List style={{ listStyle: "none", margin: 0, padding: 0 }}>{mappedTask}</List>
      }

      <Box sx={filterButtonsBox}>
        <Button
          variant={`${todolist.filter === "all" ? "contained" : "outlined"}`}
          onClick={() => changeFilterHandler("all")}
        >
          All
        </Button>
        <Button
          variant={`${todolist.filter === "active" ? "contained" : "outlined"}`}
          onClick={() => changeFilterHandler("active")}
        >
          Active
        </Button>
        <Button
          variant={`${todolist.filter === "completed" ? "contained" : "outlined"}`}
          onClick={() => changeFilterHandler("completed")}
        >
          Completed
        </Button>
      </Box>
    </div>
  )
}
