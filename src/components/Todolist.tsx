import {Task} from "./Task.tsx";
import {AddItemForm} from "./AddItemForm.tsx";
import {EditableSpan} from "./EditableSpan.tsx";
import {IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button";
import List from '@mui/material/List';
import {filterButtonsContainerSx} from "../Todolists.styles.ts";
import Box from "@mui/material/Box";
import {FilterValues, TodolistType} from "../model/todolistReducer/todolist-reducer.ts";
import {TasksStateType} from "../model/tasksReducer/tasks-reducer.ts";


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
  updateTodolistTitle: (todoId: string, newTitle: string) => void
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
    updateTaskTitle,
    updateTodolistTitle
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
  const updateTodolistTitleHandler = (newTitle: string) => {
    updateTodolistTitle(todolist.id, newTitle)
  }
  const removeTodolistHandler = () => {
    removeTodolist(todolist.id)
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
      <h3>
        <EditableSpan oldTitle={todolist.title} updateTitle={updateTodolistTitleHandler}/>
        <IconButton aria-label="delete" onClick={removeTodolistHandler}>
          <DeleteIcon/>
        </IconButton>
      </h3>
      <div>
        <AddItemForm addItem={addTaskHandler}/>
      </div>
      {
        mappedArrTasks.length === 0
          ? <p>Тасок нет</p>
          : <List>
              {mappedArrTasks}
            </List>
      }
      <div>
        <Box sx={filterButtonsContainerSx}>
          <Button variant={filter === "all" ? "contained" : "outlined"}
                  onClick={() => changeFilterHandler("all")}>all</Button>
          <Button variant={filter === "active" ? "contained" : "outlined"}
                  onClick={() => changeFilterHandler("active")}>active</Button>
          <Button variant={filter === "completed" ? "contained" : "outlined"}
                  onClick={() => changeFilterHandler("completed")}>completed</Button>
        </Box>
        <div>
          <Button sx={{mt: "20px"}}
                  size="small"
                  variant="contained"
                  onClick={() => deleteAllTasks(todolist.id)}
                  color="error">Delete all tasks</Button>
        </div>
      </div>
    </div>
  );
};

