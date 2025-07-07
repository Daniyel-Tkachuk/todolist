import {ChangeEvent} from "react";
import {EditableSpan} from "./EditableSpan.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/CheckBox";
import ListItem from '@mui/material/ListItem';
import Box from "@mui/material/Box";
import {getListItemTaskSx} from "../Todolists.styles.ts";
import {TaskType} from "../model/tasksReducer/tasks-reducer.ts";

type Props = {
  task: TaskType
  deleteTask: (taskId: string) => void
  changeTaskStatus: (taskId: string, isDone: boolean) => void
  updateTaskTitle: (taskId: string, newTitle: string) => void
}

export const Task = ({task, deleteTask, changeTaskStatus, updateTaskTitle}: Props) => {

  const deleteTaskHandler = () => {
    deleteTask(task.id)
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    changeTaskStatus(task.id, e.currentTarget.checked)
  }

  const updateTaskTitleHandler = (updateTitle: string) => {
    updateTaskTitle(task.id, updateTitle)
  }

  return (
    <ListItem sx={getListItemTaskSx(task.isDone)}>
      <Box style={{display: "flex", alignItems: "center"}}>
        <Checkbox checked={task.isDone} onChange={changeTaskStatusHandler}/>
        <EditableSpan oldTitle={task.title} updateTitle={updateTaskTitleHandler}/>
      </Box>
      <IconButton aria-label="delete" onClick={deleteTaskHandler}>
        <DeleteIcon/>
      </IconButton>
    </ListItem>
  );
};
