import React, {ChangeEvent, useState} from 'react';
import {Button} from "./Button.tsx";

type Props = {
  oldTitle: string
  onClick: () => void
  updateTaskTitle: (updateTitle: string) => void
}

export const EditableSpan = ({oldTitle, onClick, updateTaskTitle}: Props) => {
  const [edit, setEdit] = useState(false)
  const [updateTitle, setUpdateTitle] = useState(oldTitle)

  const onClickHandler = () => {
    onClick()
  }

  const onEditHandler = () => {
    setEdit(true)
  }

  const onBlurHandler = () => {
    updateTaskTitle(updateTitle)
    setEdit(false);
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdateTitle(e.currentTarget.value)
  }

  return (
    <>
      {
        edit
          ? <input type="text" value={updateTitle} autoFocus onChange={onChangeHandler} onBlur={onBlurHandler}/>
          : <span style={{display: "inline-block", marginRight: "10px"}}
                  onDoubleClick={onEditHandler}>{oldTitle}</span>
      }
      <Button title="X" onClick={onClickHandler}/>
    </>
  );
};