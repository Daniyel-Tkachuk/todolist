import * as React from "react";
import './App.css'
import {Todolist} from "./components/Todolist.tsx";
import {useState} from "react";
import {AddItemForm} from "./components/AddItemForm.tsx";
import Box from "@mui/material/Box";
import {Container, createTheme, CssBaseline, Grid, Paper, ThemeProvider} from "@mui/material";
import Header from "./components/Header.tsx";


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

  const [todolists, setTodolists] = useState<TodolistType[]>([
    {id: todolistId_1, title: 'What to learn', filter: 'all'},
    {id: todolistId_2, title: 'What to buy', filter: 'all'},
  ])

  const [tasks, setTasks] = useState<TasksStateType>({
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

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: "#087EA4"
      }
    }
  })

  const removeTodolist = (todoId: string) => {
    setTodolists(todolists.filter(tl => tl.id !== todoId))
    deleteAllTasks(todoId)
  }
  const addTodolist = (todoTitle: string) => {
    const newTodoId = crypto.randomUUID()
    const newTodo: TodolistType = {id: newTodoId, title: todoTitle, filter: "all"}

    setTodolists([newTodo, ...todolists])
    setTasks({...tasks, [newTodoId]: []})
  }
  const updateTodolistTitle = (todoId: string, newTitle: string) => {
    setTodolists(todolists.map(tl => tl.id === todoId ? {...tl, title: newTitle} : tl))
  }

  const deleteAllTasks = (todoId: string) => {
    const copyState = {...tasks}
    delete copyState[todoId]
    setTasks(copyState)
  }
  const deleteTask = (todoId: string, taskId: string) => {
    setTasks({...tasks, [todoId]: tasks[todoId].filter(t => t.id !== taskId)})
  }
  const changeTaskStatus = (todoId: string, taskId: string, isDone: boolean) => {
    setTasks({...tasks, [todoId]: tasks[todoId].map(t => t.id === taskId ? {...t, isDone} : t)})
  }
  const createTask = (id: string, taskTitle: string, isDone: boolean = false): TaskType => {
    return {id, title: taskTitle, isDone}
  }
  const addTask = (todoId: string, taskTitle: string) => {
    const newTask = createTask(crypto.randomUUID(), taskTitle);
    setTasks({...tasks, [todoId]: [newTask, ...tasks[todoId]]})
  }
  const changeFilter = (todoId: string, filter: FilterValues) => {
    setTodolists(todolists.map(tl => tl.id === todoId ? {...tl, filter} : tl))
  }
  const updateTaskTitle = (todoId: string, taskId: string, updateTitle: string) => {
    setTasks({...tasks, [todoId]: tasks[todoId].map(t => t.id === taskId ? {...t, title: updateTitle} : t)})
  }

  const changeMode = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light')
  }


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header changeMode={changeMode}/>
      <Container fixed maxWidth="xl">
        <Grid container sx={{m: "95px 0 30px"}}>
          <Box>
            <AddItemForm addItem={addTodolist}/>
          </Box>
        </Grid>

        <Grid container spacing={3}>
          {
            todolists.map(el => (
              <Grid size={3} sx={{maxWidth: "500px"}}>
                <Paper elevation={5} sx={{p: "10px 30px 20px 35px"}}>
                  <Todolist key={el.id}
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
