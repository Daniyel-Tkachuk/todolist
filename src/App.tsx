import * as React from "react";
import './App.css'
import {Todolist} from "./components/Todolist.tsx";
import {useReducer, useState} from "react";
import {AddItemForm} from "./components/AddItemForm.tsx";
import Box from "@mui/material/Box";
import {Container, createTheme, CssBaseline, Grid, Paper, ThemeProvider} from "@mui/material";
import Header from "./components/Header.tsx";
import {
  changeTaskStatusAC,
  createTaskAC, deleteAllTasksAC,
  deleteTaskAC,
  tasksReducer,
  updateTaskTitleAC
} from "./model/tasksReducer/tasks-reducer.ts";
import {
  changeTodolistFilterAC,
  createTodolistAC,
  removeTodolistAC,
  todolistReducer,
  updateTodolistAC
} from "./model/todolistReducer/todolist-reducer.ts";


export type TaskType = {
  id: string
  title: string
  isDone: boolean
}

export type TasksStateType = {
  [key: string]: TaskType[]
}

export type TodolistType = {
  id: string
  title: string
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
export type ThemeMode = 'light' | 'dark'

export const App = () => {
  const todolistId_1 = crypto.randomUUID()
  const todolistId_2 = crypto.randomUUID()

  const [themeMode, setThemeMode] = useState<ThemeMode>('light')

  const [todolists, dispatchTodolist] = useReducer(todolistReducer, [
    {id: todolistId_1, title: 'What to learn', filter: 'all'},
    {id: todolistId_2, title: 'What to buy', filter: 'all'},
  ])

  const [tasks, dispatchTasks] = useReducer(tasksReducer, {
    [todolistId_1]: [
      {id: crypto.randomUUID(), title: 'HTML&CSS', isDone: true},
      {id: crypto.randomUUID(), title: 'JS', isDone: true},
      {id: crypto.randomUUID(), title: 'ReactJS', isDone: false},
    ],
    [todolistId_2]: [
      {id: crypto.randomUUID(), title: 'Rest API', isDone: true},
      {id: crypto.randomUUID(), title: 'GraphQL', isDone: false},
    ],
  })


  console.log("todolists -->", todolists)
  console.log("tasks -->", tasks)

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: "#087EA4",
      }
    }
  })

  const removeTodolist = (todoId: string) => {
    dispatchTodolist(removeTodolistAC(todoId))
    dispatchTasks(removeTodolistAC(todoId))
  }
  const addTodolist = (todoTitle: string) => {
    const newTodoId = crypto.randomUUID()
    dispatchTodolist(createTodolistAC(newTodoId, todoTitle))
    dispatchTasks(createTodolistAC(newTodoId, todoTitle))
  }
  const updateTodolistTitle = (todoId: string, newTitle: string) => {
    dispatchTodolist(updateTodolistAC(todoId, newTitle))
  }
  const changeFilter = (todoId: string, filter: FilterValues) => {
    dispatchTodolist(changeTodolistFilterAC(todoId, filter))
  }

  const deleteAllTasks = (todoId: string) => {
    dispatchTasks(deleteAllTasksAC(todoId))
  }
  const deleteTask = (todoId: string, taskId: string) => {
    dispatchTasks(deleteTaskAC(todoId, taskId))
  }
  const addTask = (todoId: string, taskTitle: string) => {
    dispatchTasks(createTaskAC(todoId, taskTitle))
  }
  const changeTaskStatus = (todoId: string, taskId: string, isDone: boolean) => {
    dispatchTasks(changeTaskStatusAC(todoId, taskId, isDone))
  }
  const updateTaskTitle = (todoId: string, taskId: string, updateTitle: string) => {
    dispatchTasks(updateTaskTitleAC(todoId, taskId, updateTitle))
  }

  const changeMode = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light')
  }


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Header changeMode={changeMode}/>
      <Container fixed maxWidth="xl">
        <Grid container sx={{m: "95px 0 30px"}}>
          <Box>
            <AddItemForm addItem={addTodolist}/>
          </Box>
        </Grid>

        <Grid container spacing={3}>
          {
            todolists?.map(el => (
              <Grid size={3} sx={{maxWidth: "500px"}} key={el.id}>
                <Paper elevation={5} sx={{p: "10px 30px 20px 35px"}}>
                  <Todolist
                    todolist={el}
                    tasks={tasks}
                    filter={el.filter}
                    removeTodolist={removeTodolist}
                    deleteTask={deleteTask}
                    deleteAllTasks={deleteAllTasks}
                    addTask={addTask}
                    changeTaskStatus={changeTaskStatus}
                    changeFilter={changeFilter}
                    updateTaskTitle={updateTaskTitle}
                    updateTodolistTitle={updateTodolistTitle}
                  />
                </Paper>
              </Grid>
            ))
          }
        </Grid>
      </Container>
    </ThemeProvider>
  )
}
