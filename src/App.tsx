import './App.css'
import {Todolist} from "./components/Todolist.tsx";
import {useState} from "react";

export type TaskType = {
  id: string
  title: string
  isDone: boolean
}

export type TodolistType = {
  id: string
  title: string
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"

export const App = () => {
  const [todolists, setTodolists] = useState<TodolistType[]>([
    {id: crypto.randomUUID(), title: 'What to learn', filter: 'all'},
    {id: crypto.randomUUID(), title: 'What to buy', filter: 'all'},
  ])

  const [tasks, setTasks] = useState<TaskType[]>([
    {id: crypto.randomUUID(), title: "HTML&CSS", isDone: true},
    {id: crypto.randomUUID(), title: "JS", isDone: false},
    {id: crypto.randomUUID(), title: "ReactJS", isDone: true},
    {id: crypto.randomUUID(), title: "Redux", isDone: true},
    {id: crypto.randomUUID(), title: "TypeScript", isDone: false},
    {id: crypto.randomUUID(), title: "RTK query", isDone: true},
  ])


  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId))
  }
  const deleteAllTasks = () => {
    setTasks([])
  }
  const changeTaskStatus = (taskId: string, isDone: boolean) => {
    setTasks(tasks.map(t => t.id === taskId ? {...t, isDone} : t))
  }
  const createTask = (id: string, taskTitle: string, isDone: boolean = false): TaskType => {
    return {id, title: taskTitle, isDone}
  }
  const addTask = (taskTitle: string) => {
    const newTask = createTask(crypto.randomUUID(), taskTitle);
    setTasks([newTask, ...tasks])
  }
  const changeFilter = (todoId: string, filter: FilterValues) => {
    setTodolists(todolists.map(tl => tl.id === todoId ? {...tl, filter} : tl))
  }


  return (
    <div className="app">
      {
        todolists.map(el => (
          <Todolist key={el.id}
                    todolist={el}
                    tasks={tasks}
                    filter={el.filter}
                    deleteTask={deleteTask}
                    deleteAllTasks={deleteAllTasks}
                    addTask={addTask}
                    changeTaskStatus={changeTaskStatus}
                    changeFilter={changeFilter}
          />
        ))
      }
    </div>
  )
}
