// import { Button } from "@/components/Button.tsx"
import { type ChangeEvent, type KeyboardEvent, useState } from "react"
import { Button, TextField } from "@mui/material"

type Props = {
  addItem: (title: string) => void
}

export const AddItemForm = (props: Props) => {
  const { addItem } = props

  const [taskTitle, setTaskTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.currentTarget.value)
    setError(null)
  }

  const createItemHandler = () => {
    const trimmedTitle = taskTitle.trim()
    if (trimmedTitle !== "") {
      addItem(trimmedTitle)
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

  const buttonStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    maxWidth: '50px',
    maxHeight: '40px',
    minWidth: '50px',
    minHeight: '40px',
  }

  return (
    <div style={{margin: '10px 0 5px'}}>
      <TextField
        error={!!error}
        size="small"
        variant='outlined'
        label={error ? error : 'type smth. please'}
        value={taskTitle}
        onChange={onChangeHandler}
        onKeyDown={createItemOnEnterHandler}
      />
      <Button
        variant="contained"
        sx={buttonStyle}
        onClick={createItemHandler}
      >
        +
      </Button>
      {/*{error && <div className="error-message">{error}</div>}*/}
    </div>
  )
}
