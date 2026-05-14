import {type ChangeEvent, type CSSProperties, useEffect, useState} from "react"
import Checkbox from "@mui/material/Checkbox"
import {CreateItemForm, EditableSpan} from "@/common/components"
import {Todolist} from "@/features/todolists/api/todolistsApi.types"
import {todolistsApi} from "@/features/todolists/api/todolistsApi"
import {tasksApi} from "@/features/todolists/api/tasksApi"
import {DomainTask, UpdateTaskModel} from "@/features/todolists/api/tasksApi.types"
import {TaskStatus} from "@/common/enums"

export const AppHttpRequests = () => {
  const [todolists, setTodolists] = useState<Todolist[]>([])
  const [tasks, setTasks] = useState<Record<string, DomainTask[]>>({})

  console.log(todolists)
  console.log(tasks)

  useEffect(() => {
    todolistsApi.getTodolists().then((res) => {
      const todolists = res.data
      setTodolists(todolists)
      todolists.forEach((todolist) => {
        tasksApi.getTasks(todolist.id).then((res) => {
          const arrTasks = res.data.items
          setTasks((prevState) => ({
            ...prevState,
            [todolist.id]: arrTasks,
          }))
        })
      })
    })
  }, [])

  const createTodolist = (title: string) => {
    todolistsApi.createTodolist(title).then((res) => {
      const newTodolist = res.data.data.item
      setTodolists([newTodolist, ...todolists])
      setTasks({...tasks, [newTodolist.id]: []})
    })
  }

  const deleteTodolist = (id: string) => {
    todolistsApi.deleteTodolist(id).then((res) => {
      if (res.data.resultCode === 0) {
        setTodolists(todolists.filter((tl) => tl.id !== id))
        const copyTasks = {...tasks}
        delete copyTasks[id]
        setTasks(copyTasks)
      }
    })
  }

  const changeTodolistTitle = (id: string, title: string) => {
    todolistsApi.changeTodolistTitle({id, title}).then((res) => {
      if (res.data.resultCode === 0) {
        setTodolists(todolists.map((tl) => (tl.id === id ? {...tl, title} : tl)))
      }
    })
  }

  const createTask = (todolistId: string, title: string) => {
    tasksApi.createTask({todolistId, title}).then((res) => {
      const newTask = res.data.data.item
      setTasks({...tasks, [todolistId]: [...tasks[todolistId], newTask]})
    })
  }

  const deleteTask = (todolistId: string, taskId: string) => {
    tasksApi.deleteTask({todolistId, taskId}).then((res) => {
      if (res.data.resultCode === 0) {
        setTasks({...tasks, [todolistId]: tasks[todolistId].filter((t) => t.id !== taskId)})
      }
    })
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>, task: DomainTask) => {
    const todolistId = task.todoListId
    const newStatus = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New

    const model: UpdateTaskModel = {
      status: newStatus,
      priority: task.priority,
      title: task.title,
      description: task.description,
      startDate: task.startDate,
      deadline: task.deadline,
    }

    tasksApi.updateTask({todolistId, taskId: task.id, model}).then((res) => {
      const updatedTask = {...res.data.data.item}
      setTasks({
        ...tasks,
        [todolistId]: tasks[todolistId].map((t) => (t.id === task.id ? {...updatedTask} : t)),
      })
    })
  }

  const changeTaskTitle = (task: DomainTask, title: string) => {
    const todolistId = task.todoListId

    const model: UpdateTaskModel = {
      title,
      status: task.status,
      startDate: task.startDate,
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
    }

    tasksApi.updateTask({todolistId, taskId: task.id, model}).then((res) => {
      const updatedTask = res.data.data.item
      setTasks({
        ...tasks,
        [todolistId]: tasks[todolistId].map((t) => (t.id === task.id ? updatedTask : t)),
      })
    })
  }

  return (
    <div style={{margin: "20px"}}>
      <CreateItemForm onCreateItem={createTodolist} />
      {todolists.map((todolist) => (
        <div key={todolist.id} style={container}>
          <div>
            <EditableSpan value={todolist.title} onChange={(title) => changeTodolistTitle(todolist.id, title)} />
            <button onClick={() => deleteTodolist(todolist.id)}>x</button>
          </div>
          <CreateItemForm onCreateItem={(title) => createTask(todolist.id, title)} />
          {tasks[todolist.id]?.map((task: DomainTask) => (
            <div key={task.id}>
              <Checkbox checked={task.status === TaskStatus.Completed} onChange={(e) => changeTaskStatus(e, task)} />
              <EditableSpan value={task.title} onChange={(title) => changeTaskTitle(task, title)} />
              <button onClick={() => deleteTask(todolist.id, task.id)}>x</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const container: CSSProperties = {
  border: "1px solid black",
  margin: "20px 0",
  padding: "10px",
  width: "300px",
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
}
