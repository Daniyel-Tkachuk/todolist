import './App.css'
import {Todolist} from "./components/Todolist.tsx";

export type TaskType = {
  id: number
  title: string
  isDone: boolean
}

export const App = () => {
  const tasks1: TaskType[] = [
    {id: 1, title: "task1", isDone: true},
    {id: 2, title: "task2", isDone: false},
    {id: 3, title: "task3", isDone: false},
  ]


  return (
    <div className="app">
      <Todolist title={"task-1"} tasks={tasks1}/>
    </div>
  )
}
