import {TaskType} from "../App.tsx";
import {ChangeEvent} from "react";
import {EditableSpan} from "./EditableSpan.tsx";

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
    <li className={task.isDone ? "is-done" : ""}>
      <input type="checkbox" checked={task.isDone} onChange={changeTaskStatusHandler}/>
      <EditableSpan oldTitle={task.title} onClick={deleteTaskHandler} updateTitle={updateTaskTitleHandler}/>
    </li>
  );
};
