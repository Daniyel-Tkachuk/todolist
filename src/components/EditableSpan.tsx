import React, {ChangeEvent, useState} from 'react';

type Props = {
  oldTitle: string
  updateTitle: (newTitle: string) => void
}

export const EditableSpan = ({oldTitle, updateTitle}: Props) => {
  const [edit, setEdit] = useState(false)
  const [newTitle, setNewTitle] = useState(oldTitle)

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
          : <span style={{display: "inline-block", marginRight: "10px", wordBreak: "break-word"}}
                  onDoubleClick={onEditHandler}>{oldTitle}</span>
      }
    </>
  );
};