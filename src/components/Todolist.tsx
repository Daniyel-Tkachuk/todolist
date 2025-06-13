import {FilterValues, TasksStateType, TodolistType} from "../App.tsx";
import {Button} from "./Button.tsx";
import {Task} from "./Task.tsx";
import {AddItemForm} from "./AddItemForm.tsx";


type Props = {
  todolist: TodolistType
  tasks: TasksStateType
  filter: FilterValues
  removeTodolist: (todoId: string) => void
  deleteTask: (todoId: string, taskId: string) => void
  deleteAllTasks: (todoId: string) => void
  addTask: (todoId: string, taskTitle: string) => void
  changeTaskStatus: (todoId: string, taskId: string, isDone: boolean) => void
  changeFilter: (todoId: string, filter: FilterValues) => void
  updateTaskTitle: (todoId: string, taskId: string, newTitle: string) => void
}

export const Todolist = (props: Props) => {
  const {
    tasks,
    todolist,
    filter,
    removeTodolist,
    deleteTask,
    deleteAllTasks,
    addTask,
    changeTaskStatus,
    changeFilter,
    updateTaskTitle
  } = props

  const addTaskHandler = (taskTitle: string) => {
    addTask(todolist.id, taskTitle)
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
  const updateTaskTitleHandler = (taskId: string, updateTitle: string) => {
    updateTaskTitle(todolist.id, taskId, updateTitle)
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
      <Task key={t.id}
            task={t}
            deleteTask={deleteTaskHandler}
            changeTaskStatus={changeTaskStatusHandler}
            updateTaskTitle={updateTaskTitleHandler}
      />
    )
  })

  return (
    <div>
      <h3 style={{display: "inline-block", marginRight: "10px"}}>{todolist.title}</h3>
      <Button title="X" onClick={() => removeTodolist(todolist.id)}/>
      <div>
        <AddItemForm addItem={addTaskHandler}/>
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

