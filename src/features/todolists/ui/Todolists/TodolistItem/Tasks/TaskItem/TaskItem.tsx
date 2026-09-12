import type {DomainTask} from "@/features/todolists/api/tasksApi.types"
import type {ChangeEvent} from "react"
import {EditableSpan} from "@/common/components/EditableSpan/EditableSpan"
import {useAppDispatch} from "@/common/hooks"
import {deleteTaskTC, updateTaskTC} from "@/features/todolists/model/tasks-slice"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import {getListItemSx} from "./TaskItem.styles"
import {TaskStatus} from "@/common/enums"

type Props = {
  task: DomainTask
  todolistId: string
}

export const TaskItem = ({task, todolistId}: Props) => {
  const dispatch = useAppDispatch()

  const deleteTask = () => {
    dispatch(deleteTaskTC({todolistId, taskId: task.id}))
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatusValue = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New

    dispatch(updateTaskTC({todolistId, taskId: task.id, domainModel: {status: newStatusValue}}))
  }

  const changeTaskTitle = (title: string) => {
    dispatch(updateTaskTC({todolistId, taskId: task.id, domainModel: {title}}))
  }

  const isChecked = task.status === TaskStatus.Completed

  return (
    <ListItem sx={getListItemSx(isChecked)}>
      <div>
        <Checkbox checked={isChecked} onChange={changeTaskStatus} />
        <EditableSpan value={task.title} onChange={changeTaskTitle} />
      </div>
      <IconButton onClick={deleteTask}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
