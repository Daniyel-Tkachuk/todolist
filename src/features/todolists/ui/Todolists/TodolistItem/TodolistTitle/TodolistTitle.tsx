import styles from "./TodolistTitle.module.css"
import IconButton from "@mui/material/IconButton"
import {EditableSpan} from "@/common/components/EditableSpan/EditableSpan.tsx"
import DeleteIcon from "@mui/icons-material/Delete"
import {changeTodolistTitleTC, deleteTodolistTC, DomainTodolist} from "@/features/todolists/model/todolists-slice.ts"
import {useAppDispatch} from "@/common/hooks"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = (props: Props) => {
  const {
    todolist: {id, title},
  } = props

  const dispatch = useAppDispatch()

  const deleteTodolistHandler = () => {
    dispatch(deleteTodolistTC(id))
  }

  const changeTodolistTitleHandler = (title: string) => {
    dispatch(changeTodolistTitleTC({id, title}))
  }

  return (
    <div className={styles.container}>
      <h3>
        <EditableSpan value={title} onChange={changeTodolistTitleHandler} />
      </h3>
      <IconButton onClick={deleteTodolistHandler}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
