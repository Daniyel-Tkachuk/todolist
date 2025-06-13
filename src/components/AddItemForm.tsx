import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {Button} from "./Button.tsx";

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

  return (
    <>
      <input type="text"
             className={error ? "error" : ""}
             value={title}
             onChange={setTitleHandler}
             onKeyDown={onEnterHandler}/>
      <Button title="+" onClick={addItemHandler}/>
      {error && <div className="error-message">{error}</div>}
    </>
  );
};
