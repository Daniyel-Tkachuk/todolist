import {changeTaskStatus, changeTaskTitle, deleteTask, Task} from "@/features/todolists/model/tasks-slice.ts"
import Checkbox from "@mui/material/Checkbox"
import {EditableSpan} from "@/common/components/EditableSpan/EditableSpan.tsx"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import ListItem from "@mui/material/ListItem"
import {ChangeEvent} from "react"
import {getListItemSx} from "./TaskItem.styles.ts"
import {useAppDispatch} from "@/common/hooks"

type Props = {
  task: Task
  todolistId: string
}

export const TaskItem = (props: Props) => {
  const {task, todolistId} = props

  const dispatch = useAppDispatch()

  const deleteTaskHandler = () => {
    dispatch(deleteTask({todolistId, taskId: task.id}))
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatusValue = e.currentTarget.checked
    dispatch(changeTaskStatus({todolistId, taskId: task.id, isDone: newStatusValue}))
  }

  const changeTaskTitleHandler = (title: string) => {
    dispatch(changeTaskTitle({todolistId, taskId: task.id, title}))
  }

  return (
    <ListItem key={task.id} sx={getListItemSx(task.isDone)}>
      <div>
        <Checkbox checked={task.isDone} onChange={changeTaskStatusHandler} />
        <EditableSpan value={task.title} onChange={changeTaskTitleHandler} />
      </div>
      <IconButton onClick={deleteTaskHandler}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
