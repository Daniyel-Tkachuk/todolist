import List from "@mui/material/List"
import {selectTasks, Task} from "@/features/todolists/model/tasks-slice.ts"
import {DomainTodolist} from "@/features/todolists/model/todolists-slice.ts"
import {TaskItem} from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.tsx"
import {useAppSelector} from "@/common/hooks"
import {useEffect} from "react"
import {tasksApi} from "@/features/todolists/api/tasksApi"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({todolist}: Props) => {
  const {id, filter} = todolist

  const tasks = useAppSelector(selectTasks)

  useEffect(() => {
    tasksApi.getTasks(id).then((res) => {
      console.log(res)
    })
  }, [])

  const todolistTasks = tasks[id]
  let filteredTasks = todolistTasks
  if (filter === "active") {
    filteredTasks = todolistTasks.filter((task: Task) => !task.isDone)
  }
  if (filter === "completed") {
    filteredTasks = todolistTasks.filter((task: Task) => task.isDone)
  }

  return filteredTasks?.length === 0 ? (
    <p>Тасок нет</p>
  ) : (
    <List>
      {filteredTasks?.map((task: Task) => {
        return <TaskItem task={task} todolistId={id} />
      })}
    </List>
  )
}
