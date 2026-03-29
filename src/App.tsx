import "./App.css"
import { TodolistItem } from "./components/TodolistItem.tsx"
import { TasksState } from "./types.ts"
import { useState } from "react"
import { v1 } from "uuid"
import { AddItemForm } from "@/components/AddItemForm.tsx"

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
      { id: v1(), title: 'HTML&CSS', isDone: true },
      { id: v1(), title: 'JS', isDone: true },
      { id: v1(), title: 'ReactJS', isDone: false },
    ],
    [todolistId2]: [
      { id: v1(), title: 'Rest API', isDone: true },
      { id: v1(), title: 'GraphQL', isDone: false },
    ],
  })

  const createTodolist = (title: string) => {
    const newTodolistId = v1()
    const newTodolist: Todolist = {
      id: newTodolistId,
      title,
      filter: "all"
    }
    setTodolists([newTodolist, ...todolists])
    setTasks({...tasks, [newTodolistId]: []})
  }

  const deleteTodolist = (todolistId: string) => {
    setTodolists((prevState) => prevState.filter(t => t.id !== todolistId))
    deleteTasks(todolistId)
  }

  const deleteTasks = (todolistId: string) => {
    delete tasks[todolistId]
    setTasks({...tasks})
  }

  const deleteTask = (todolistId: string, taskId: string) => {
    setTasks({...tasks, [todolistId]: tasks[todolistId].filter(t => t.id !== taskId)})
  }

  const createTask = (todolistId: string, title: string) => {
    const newTask = { id: v1(), title, isDone: false }
    setTasks({...tasks, [todolistId]: [newTask, ...tasks[todolistId]]})
  }

  const changeTaskStatus = (todolistId:string, taskId: string, isDone: boolean) => {
    setTasks({...tasks, [todolistId]: tasks[todolistId].map(t => t.id === taskId ? {...t, isDone} : t)})
  }

	const changeFilter = (todolistId: string, filter: FilterValues) => {
		setTodolists(todolists.map(tl => tl.id === todolistId ? {...tl, filter} : tl))
	}

  return (
    <div className="app">
      <AddItemForm onCreateItem={createTodolist}/>
			{
				todolists
					.map(tl => (
						<TodolistItem
							key={tl.id}
							todolist={tl}
							tasks={tasks}
							deleteTask={deleteTask}
							createTask={createTask}
							changeFilter={changeFilter}
							changeTaskStatus={changeTaskStatus}
              deleteTodolist={deleteTodolist}
						/>
					))
			}
    </div>
  )
}

export default App
