import './App.css'
import {Todolist} from "./components/Todolist.tsx";
import {useState} from "react";

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

const todolistId_1 = crypto.randomUUID()
const todolistId_2 = crypto.randomUUID()

export const App = () => {
  const [todolists, setTodolists] = useState<TodolistType[]>([
    {id: todolistId_1, title: 'What to learn', filter: 'all'},
    {id: todolistId_2, title: 'What to buy', filter: 'all'},
  ])

  const [tasks, setTasks] = useState<TasksStateType>({
    [todolistId_1]: [
      { id: crypto.randomUUID(), title: 'HTML&CSS', isDone: true },
      { id: crypto.randomUUID(), title: 'JS', isDone: true },
      { id: crypto.randomUUID(), title: 'ReactJS', isDone: false },
    ],
    [todolistId_2]: [
      { id: crypto.randomUUID(), title: 'Rest API', isDone: true },
      { id: crypto.randomUUID(), title: 'GraphQL', isDone: false },
    ],
  })


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
