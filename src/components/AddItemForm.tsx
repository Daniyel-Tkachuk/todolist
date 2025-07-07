import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

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
    maxWidth: "38px",
    maxHeight: "38px",
    minWidth: "38px",
    minHeight: "40px",
    fontSize: "16px",
    fontWeight: 500,
    borderRadius: "0 4px 4px 0",
  }

  return (
    <>
      <TextField className={error ? "error" : ""}
                 error={!!error}
                 size="small"
                 value={title}
                 label={error ? error : "Enter text"}
                 variant="outlined"
                 sx={{
                   "& .MuiInputBase-root": {
                     borderRadius: "4px 0 0 4px"
                   }
                 }}
                 onChange={setTitleHandler}
                 onKeyDown={onEnterHandler}
      />
      <Button style={buttonStyle} variant="contained" size="small" onClick={addItemHandler}>+</Button>
    </>
  );
};
