import styles from "./TodolistTitle.module.css"
import {useDispatch} from "react-redux";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {changeTodolistTitleAC, deleteTodolistAC, Todolist} from "@/features/todolists/model/todolists-reducer.ts";
import {EditableSpan} from "@/common/components/EditableSpan/EditableSpan.tsx";


type Props = {
  todolist: Todolist
}

export const TodolistTitle = ({todolist}: Props) => {
  const {id, title} = todolist

  const dispatch = useDispatch()

  const changeTodolistTitle = (title: string) => {
    dispatch(changeTodolistTitleAC({id, title}))
  }

  const deleteTodolist = () => {
    dispatch(deleteTodolistAC({id}))
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