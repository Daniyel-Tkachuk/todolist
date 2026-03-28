import { Button } from "@/components/Button.tsx"
import { type ChangeEvent, type KeyboardEvent, useState } from "react"

type Props = {
  todolistId: string
  createTask: (todolistId: string, title: string) => void
}

export const AddItemForm = (props: Props) => {
  const {todolistId, createTask} = props

  const [taskTitle, setTaskTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  const changeTaskTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.currentTarget.value)
    setError(null)
  }

  const createTaskHandler = () => {
    const trimmedTitle = taskTitle.trim()
    if (trimmedTitle !== "") {
      createTask(todolistId, trimmedTitle)
    } else {
      setError("Title is required")
    }
    setTaskTitle("")
  }

  const createTaskOnEnterHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      createTaskHandler()
    }
  }

  return (
    <div>
      <input
        value={taskTitle}
        className={error ? "error" : ""}
        onChange={changeTaskTitleHandler}
        onKeyDown={createTaskOnEnterHandler}
      />
      <Button title="+" onClick={createTaskHandler} />
      {error && <div className="error-message">{error}</div>}
    </div>
  )
}
