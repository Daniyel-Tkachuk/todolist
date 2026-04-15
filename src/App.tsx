import "./App.css"
import { TodolistItem } from "./components/TodolistItem.tsx"
import { Task, TasksState } from "./types.ts"
import { useState } from "react"
import { v1 } from "uuid"
import { AddItemForm } from "@/components/AddItemForm.tsx"
import { Header } from "@/components/Header.tsx"
import { Container, CssBaseline, Grid, Paper } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"

type ThemeMode = "light" | "dark"

export type Todolist = {
  id: string
  title: string
  filter: FilterValues
}
export type FilterValues = "all" | "active" | "completed"

const todolistId1 = v1()
const todolistId2 = v1()

function App() {
  const [todolists, setTodolists] = useState<Todolist[]>([
    { id: todolistId1, title: "What to learn", filter: "all" },
    { id: todolistId2, title: "What to buy", filter: "all" }
  ])

  const [tasks, setTasks] = useState<TasksState>({
    [todolistId1]: [
      { id: v1(), title: "HTML&CSS", isDone: true },
      { id: v1(), title: "JS", isDone: true },
      { id: v1(), title: "ReactJS", isDone: false }
    ],
    [todolistId2]: [
      { id: v1(), title: "Rest API", isDone: true },
      { id: v1(), title: "GraphQL", isDone: false }
    ]
  })

  const [themeMode, setThemeMode] = useState<ThemeMode>("light")

  const theme = createTheme({
    palette: {
      mode:themeMode,
      primary: {
        main: '#ef6c00',
      }
    }
  })

  const changeThemeMode = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light')
  }

  const createTodolist = (title: string) => {
    const newTodolistId = v1()
    const newTodolist: Todolist = {
      id: newTodolistId,
      title,
      filter: "all"
    }
    setTodolists([newTodolist, ...todolists])
    setTasks({ ...tasks, [newTodolistId]: [] })
  }

  const deleteTodolist = (todolistId: string) => {
    setTodolists((prevState) => prevState.filter(t => t.id !== todolistId))
    deleteTasks(todolistId)
  }

  const updateTodolistTitle = (todolistId: string, title: string) => {
    setTodolists(todolists.map(tl => tl.id === todolistId ? { ...tl, title } : tl))
  }

  const deleteTasks = (todolistId: string) => {
    delete tasks[todolistId]
    setTasks({ ...tasks })
  }

  const deleteTask = (todolistId: string, taskId: string) => {
    setTasks({ ...tasks, [todolistId]: tasks[todolistId].filter(t => t.id !== taskId) })
  }

  const createTask = (todolistId: string, title: string) => {
    const newTask: Task = { id: v1(), title, isDone: false }
    setTasks({ ...tasks, [todolistId]: [newTask, ...tasks[todolistId]] })
  }

  const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => {
    setTasks({ ...tasks, [todolistId]: tasks[todolistId].map(t => t.id === taskId ? { ...t, isDone } : t) })
  }

  const changeFilter = (todolistId: string, filter: FilterValues) => {
    setTodolists(todolists.map(tl => tl.id === todolistId ? { ...tl, filter } : tl))
  }

  const updateTaskTitle = (todolistId: string, taskId: string, title: string) => {
    setTasks({
      ...tasks,
      [todolistId]: tasks[todolistId].map(t => t.id === taskId ? { ...t, title } : t)
    })
  }

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Container fixed maxWidth="xl">
          <Header changeThemeMode={changeThemeMode}/>
          <Grid container sx={{ mb: '30px' }}>
            <AddItemForm addItem={createTodolist} />
          </Grid>
          <Grid container spacing={6}>
            {
              todolists
                .map(tl => (
                  <Grid key={tl.id}>
                    <Paper sx={{ p: '20px 20px 20px 20px'}} elevation={4}>
                      <TodolistItem
                        todolist={tl}
                        tasks={tasks}
                        deleteTask={deleteTask}
                        createTask={createTask}
                        changeFilter={changeFilter}
                        changeTaskStatus={changeTaskStatus}
                        deleteTodolist={deleteTodolist}
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
    </div>
  )
}

export default App
