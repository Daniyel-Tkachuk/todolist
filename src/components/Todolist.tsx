import {FilterValues, TasksStateType, TodolistType} from "../App.tsx";
import {Button} from "./Button.tsx";
import {Task} from "./Task.tsx";
import {ChangeEvent, useState, KeyboardEvent} from "react";

type Props = {
  todolist: TodolistType
  tasks: TasksStateType
  filter: FilterValues
  deleteTask: (todoId: string, taskId: string) => void
  deleteAllTasks: (todoId: string) => void
  addTask: (todoId: string, taskTitle: string) => void
  changeTaskStatus: (todoId: string, taskId: string, isDone: boolean) => void
  changeFilter: (todoId: string, filter: FilterValues) => void
}

export const Todolist = (props: Props) => {
  const {
    tasks,
    todolist,
    filter,
    deleteTask,
    deleteAllTasks,
    addTask,
    changeTaskStatus,
    changeFilter
  } = props

  const [taskTitle, setTaskTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  const setTaskTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.currentTarget.value)
    setError(null)
  }
  const onEnterHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTaskHandler()
    }
  }
  const addTaskHandler = () => {
    const trimmedTitle = taskTitle.trim()
    if (trimmedTitle !== "") {
      addTask(todolist.id, trimmedTitle)
      setTaskTitle("")
    } else {
      setError("Title is required!")
    }
  }
  const changeFilterHandler = (filter: FilterValues) => {
    changeFilter(todolist.id, filter)
  }
  const deleteTaskHandler = (taskId: string) => {
    deleteTask(todolist.id, taskId)
  }
  const changeTaskStatusHandler = (taskId: string, isDone: boolean) => {
    changeTaskStatus(todolist.id, taskId, isDone)
  }

  const getFilteredTasks = () => {
    let tasksForTodolist = tasks[todolist.id] || []

    switch (filter) {
      case "active": {
        return tasksForTodolist.filter((task) => !task.isDone)
      }
      case "completed": {
        return tasksForTodolist.filter((task) => task.isDone)
      }
      default: {
        return tasksForTodolist
      }
    }
  }

  const mappedArrTasks = getFilteredTasks().map(t => {
    return (
      <Task key={t.id} task={t} deleteTask={deleteTaskHandler} changeTaskStatus={changeTaskStatusHandler}/>
    )
  })

  return (
    <div>
      <h3>{todolist.title}</h3>
      <div>
        <input type="text"
               className={error ? "error" : ""}
               value={taskTitle}
               onChange={setTaskTitleHandler}
               onKeyDown={onEnterHandler}/>
        <Button title="+" onClick={addTaskHandler}/>
        {error && <div className="error-message">{error}</div>}
      </div>
      {
        mappedArrTasks.length === 0
          ? <p>Тасок нет</p>
          : <ul>
            {mappedArrTasks}
          </ul>
      }
      <div>
        <div>
          <Button className={filter === "all" ? "active-filter" : ""}
                  title={"all"}
                  onClick={() => changeFilterHandler("all")}
          />
          <Button className={filter === "active" ? "active-filter" : ""}
                  title={"active"}
                  onClick={() => changeFilterHandler("active")}
          />
          <Button className={filter === "completed" ? "active-filter" : ""}
                  title={"completed"}
                  onClick={() => changeFilterHandler("completed")}
          />
        </div>
        <div>
          <Button title={"Delete all tasks"} onClick={() => deleteAllTasks(todolist.id)}/>
        </div>
      </div>
    </div>
  );
};

