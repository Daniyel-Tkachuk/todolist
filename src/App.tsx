import './App.css'
import {Todolist} from "./components/Todolist.tsx";

export type TaskType = {
  id: number
  title: string
  isDone: boolean
}

export const App = () => {
  const tasks: TaskType[] = [
    {id: 1, title: "HTML&CSS", isDone: true},
    {id: 2, title: "JS", isDone: false},
    {id: 3, title: "ReactJS", isDone: false},
    {id: 4, title: "Redux", isDone: false},
    {id: 5, title: "TypeScript", isDone: false},
    {id: 6, title: "RTK query", isDone: false},
  ]


  return (
    <div className="app">
      <Todolist title={"task-1"} tasks={tasks}/>
    </div>
  )
}
