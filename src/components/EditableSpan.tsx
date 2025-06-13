import React, {ChangeEvent, useState} from 'react';
import {Button} from "./Button.tsx";

type Props = {
  oldTitle: string
  onClick: () => void
  updateTitle: (newTitle: string) => void
}

export const EditableSpan = ({oldTitle, onClick, updateTitle}: Props) => {
  const [edit, setEdit] = useState(false)
  const [newTitle, setNewTitle] = useState(oldTitle)

  const onClickHandler = () => {
    onClick()
  }

  const onEditHandler = () => {
    setEdit(true)
  }

  const onBlurHandler = () => {
    updateTitle(newTitle)
    setEdit(false);
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.currentTarget.value)
  }

  return (
    <>
      {
        edit
          ? <input type="text" value={newTitle} autoFocus onChange={onChangeHandler} onBlur={onBlurHandler}/>
          : <span style={{display: "inline-block", marginRight: "10px"}}
                  onDoubleClick={onEditHandler}>{oldTitle}</span>
      }
      <Button title="X" onClick={onClickHandler}/>
    </>
  );
};