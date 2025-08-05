import {getListItemSx} from "@/TodolistItem.styles.ts";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "@/EditableSpan.tsx";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItem from "@mui/material/ListItem";
import {changeTaskStatusAC, changeTaskTitleAC, deleteTaskAC, Task} from "@/model/tasks-reducer.ts";
import type {ChangeEvent} from "react";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";

type Props = {
  task: Task
  todolistId: string
}

export const TaskItem = ({task, todolistId}: Props) => {

  const dispatch = useAppDispatch()

  const deleteTask = (taskId: string) => {
    dispatch(deleteTaskAC({todolistId, taskId}))
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>, taskId: string) => {
    const newStatusValue = e.currentTarget.checked
    dispatch(changeTaskStatusAC({todolistId, taskId, isDone: newStatusValue}))
  }

  const changeTaskTitle = (taskId: string, title: string) => {
    dispatch(changeTaskTitleAC({todolistId, taskId, title}))
  }

  return (
    <ListItem sx={getListItemSx(task.isDone)}>
      <div>
        <Checkbox checked={task.isDone} onChange={(e) => changeTaskStatus(e, task.id)}/>
        <EditableSpan value={task.title} onChange={(title) => changeTaskTitle(task.id, title)}/>
      </div>
      <IconButton onClick={() => deleteTask(task.id)}>
        <DeleteIcon/>
      </IconButton>
    </ListItem>
  );
};