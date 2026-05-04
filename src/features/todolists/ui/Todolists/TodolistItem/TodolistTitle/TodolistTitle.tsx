import styles from './TodolistTitle.module.css'
import IconButton from "@mui/material/IconButton";
import {EditableSpan} from "@/common/components/EditableSpan/EditableSpan.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import {changeTodolistTitleAC, deleteTodolistAC, Todolist} from "@/features/todolists/model/todolists-reducer.ts";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";

type Props = {
  todolist: Todolist
}

export const TodolistTitle = (props: Props) => {
  const {
    todolist: {id, title}
  } = props

  const dispatch = useAppDispatch()

  const deleteTodolist = () => {
    dispatch(deleteTodolistAC({id}))
  }

  const changeTodolistTitle = (title: string) => {
    dispatch(changeTodolistTitleAC({id, title}))
  }

  return (
    <div className={styles.container}>
      <h3>
        <EditableSpan value={title} onChange={changeTodolistTitle}/>
      </h3>
      <IconButton onClick={deleteTodolist}>
        <DeleteIcon/>
      </IconButton>
    </div>
  );
};
