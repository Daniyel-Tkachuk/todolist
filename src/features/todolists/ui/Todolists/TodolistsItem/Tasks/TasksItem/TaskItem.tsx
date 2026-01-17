import type {ChangeEvent} from "react";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "@/common/components/EditableSpan/EditableSpan.tsx";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItem from "@mui/material/ListItem";
import {changeTaskStatusAC, changeTaskTitleAC, deleteTaskAC, Task} from "@/features/todolists/model/tasks-reducer.ts";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";
import {getListItemSx} from "@/features/todolists/ui/Todolists/TodolistsItem/Tasks/TasksItem/TaskItem.styles.ts";

type Props = {
  todolistId: string
  task: Task
}

export const TaskItem = ({todolistId, task}: Props) => {
  const dispatch = useAppDispatch()

  const deleteTask = () => {
    dispatch(deleteTaskAC({todolistId, taskId: task.id}))
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatusValue = e.currentTarget.checked
    dispatch(changeTaskStatusAC({todolistId, taskId: task.id, isDone: newStatusValue}))
  }

  const changeTaskTitle = (title: string) => {
    dispatch(changeTaskTitleAC({todolistId, taskId: task.id, title}))
  }

  return (
    <ListItem sx={getListItemSx(task.isDone)}>
      <div>
        <Checkbox checked={task.isDone} onChange={changeTaskStatus}/>
        <EditableSpan value={task.title} onChange={changeTaskTitle}/>
      </div>
      <IconButton onClick={deleteTask}>
        <DeleteIcon/>
      </IconButton>
    </ListItem>
  );
};
