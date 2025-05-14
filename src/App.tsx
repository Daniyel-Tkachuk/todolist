import './App.css'
import {Todolist} from "./components/Todolist.tsx";
import {useState} from "react";

export type TaskType = {
  id: number
  title: string
  isDone: boolean
}

export type FilterTasks = "all" | "active" | "completed"

export const App = () => {
  const [tasks, setTasks] = useState<TaskType[]>([
    {id: 1, title: "HTML&CSS", isDone: true},
    {id: 2, title: "JS", isDone: false},
    {id: 3, title: "ReactJS", isDone: true},
    {id: 4, title: "Redux", isDone: true},
    {id: 5, title: "TypeScript", isDone: false},
    {id: 6, title: "RTK query", isDone: true},
  ])

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  return (
    <div className="app">
      <Todolist title={"task-1"}
                tasks={tasks}
                deleteTask={deleteTask}
      />
    </div>
  )
}
