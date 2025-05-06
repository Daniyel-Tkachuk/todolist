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

  const tasks2: TaskType[] = [
    {id: 4, title: "task4", isDone: true},
    {id: 5, title: "task5", isDone: true},
    {id: 6, title: "task6", isDone: false},
  ]

  const tasks3: TaskType[] = []

  return (
    <div className="app">
      <Todolist title={"task-1"} tasks={tasks1}/>
      <Todolist title={"task-2"} tasks={tasks2}/>
      <Todolist title={"task-3"} tasks={tasks3}/>
    </div>
  )
}
