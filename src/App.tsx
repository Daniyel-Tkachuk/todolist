import './App.css'
import {Todolist} from "./components/Todolist.tsx";
import {useState} from "react";

export type TaskType = {
  id: string
  title: string
  isDone: boolean
}

export type FilterTasks = "all" | "active" | "completed"

export const App = () => {
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

  return (
    <div className="app">
      <Todolist title={"task-1"}
                tasks={tasks}
                deleteTask={deleteTask}
                deleteAllTasks={deleteAllTasks}
      />
    </div>
  )
}
