import { ChangeEvent, KeyboardEvent, useState } from "react"

type Props = {
  title: string
  setTitle: (title: string) => void
}

export const EditableSpan = (props: Props) => {
  const { title, setTitle } = props

  const [newTitle, setNewTitle] = useState(title)
  const [edit, setEdit] = useState(false)

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.currentTarget.value)
  }

  const onEditHandler = () => {
    setEdit(true)
  }

  const onBlurHandler = () => {
    setTitle(newTitle)
    setEdit(false)
  }

  const onEnterHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onBlurHandler()
    }
  }


  return (
    <>
      {
        edit ? (
          <input
            autoFocus
            value={newTitle}
            onKeyDown={onEnterHandler}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
          />
        ) : (
          <span onDoubleClick={onEditHandler}>{title}</span>
        )}
    </>
  )
}
