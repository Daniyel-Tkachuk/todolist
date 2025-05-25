import {FilterValues, TaskType, TodolistType} from "../App.tsx";
import {Button} from "./Button.tsx";
import {Task} from "./Task.tsx";
import {ChangeEvent, useState, KeyboardEvent} from "react";

type Props = {
  todolist: TodolistType
  tasks: TaskType[]
  filter: FilterValues
  deleteTask: (taskId: string) => void
  deleteAllTasks: () => void
  addTask: (taskTitle: string) => void
  changeTaskStatus: (taskId: string, isDone: boolean) => void
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
      addTask(trimmedTitle)
      setTaskTitle("")
    } else {
      setError("Title is required!")
    }
  }
  const changeFilterHandler = (filter: FilterValues) => {
    changeFilter(todolist.id, filter)
  }

  const getFilteredTasks = () => {
    switch (filter) {
      case "active": {
        return tasks.filter((task) => !task.isDone)
      }
      case "completed": {
        return tasks.filter((task) => task.isDone)
      }
      default: {
        return tasks
      }
    }
  }

  const mappedArrTasks = getFilteredTasks().map(t => {
    return (
      <Task key={t.id} task={t} deleteTask={deleteTask} changeTaskStatus={changeTaskStatus}/>
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
          <Button title={"Delete all tasks"} onClick={deleteAllTasks}/>
        </div>
      </div>
    </div>
  );
};

