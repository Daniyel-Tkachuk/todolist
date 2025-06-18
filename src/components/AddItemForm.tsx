import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import Button from "@mui/material/Button";

type Props = {
  addItem: (title: string) => void
}

export const AddItemForm = ({addItem}: Props) => {
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  const setTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
    setError(null)
  }
  const onEnterHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addItemHandler()
    }
  }
  const addItemHandler = () => {
    const trimmedTitle = title.trim()
    if (trimmedTitle !== "") {
      addItem(trimmedTitle)
      setTitle("")
    } else {
      setError("Title is required!")
    }
  }

  const buttonStyle = {
    maxWidth: "30px",
    maxHeight: "30px",
    minWidth: "30px",
    minHeight: "30px",
    fontSize: "16px",
    fontWeight: 500
  }

  return (
    <>
      <input type="text"
             className={error ? "error" : ""}
             value={title}
             onChange={setTitleHandler}
             onKeyDown={onEnterHandler}/>
      <Button style={buttonStyle} variant="contained" size="small" onClick={addItemHandler}>+</Button>
      {error && <div className="error-message">{error}</div>}
    </>
  );
};
