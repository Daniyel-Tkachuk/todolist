import { Button } from "@/components/Button.tsx"
import { type ChangeEvent, type KeyboardEvent, useState } from "react"

type Props = {
  onCreateItem: (title: string) => void
}

export const AddItemForm = (props: Props) => {
  const {onCreateItem} = props

  const [taskTitle, setTaskTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.currentTarget.value)
    setError(null)
  }

  const createItemHandler = () => {
    const trimmedTitle = taskTitle.trim()
    if (trimmedTitle !== "") {
      onCreateItem(trimmedTitle)
    } else {
      setError("Title is required")
    }
    setTaskTitle("")
  }

  const createItemOnEnterHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      createItemHandler()
    }
  }

  return (
    <div>
      <input
        value={taskTitle}
        className={error ? "error" : ""}
        onChange={onChangeHandler}
        onKeyDown={createItemOnEnterHandler}
      />
      <Button title="+" onClick={createItemHandler} />
      {error && <div className="error-message">{error}</div>}
    </div>
  )
}
