import {deleteTaskTC, updateTaskTC} from "@/features/todolists/model/tasks-slice.ts"
import Checkbox from "@mui/material/Checkbox"
import {EditableSpan} from "@/common/components/EditableSpan/EditableSpan.tsx"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import ListItem from "@mui/material/ListItem"
import {ChangeEvent} from "react"
import {getListItemSx} from "./TaskItem.styles.ts"
import {useAppDispatch} from "@/common/hooks"
import {TaskStatus} from "@/common/enums"
import type {DomainTask} from "@/features/todolists/api/tasksApi.types"

type Props = {
  task: DomainTask
  todolistId: string
}

export const TaskItem = (props: Props) => {
  const {task, todolistId} = props

  const dispatch = useAppDispatch()

  const deleteTaskHandler = () => {
    dispatch(deleteTaskTC({todolistId, taskId: task.id}))
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatusValue = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    const model = {
      status: newStatusValue,
    }
    dispatch(updateTaskTC({todolistId, taskId: task.id, model}))
  }

  const changeTaskTitleHandler = (title: string) => {
    const model = {
      title,
    }
    dispatch(updateTaskTC({todolistId, taskId: task.id, model}))
  }

  const isTaskCompleted = task.status === TaskStatus.Completed

  return (
    <ListItem key={task.id} sx={getListItemSx(isTaskCompleted)}>
      <div>
        <Checkbox checked={isTaskCompleted} onChange={changeTaskStatusHandler} />
        <EditableSpan value={task.title} onChange={changeTaskTitleHandler} />
      </div>
      <IconButton onClick={deleteTaskHandler}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
