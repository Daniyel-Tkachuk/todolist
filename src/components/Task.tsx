import {TaskType} from "../App.tsx";
import {Button} from "./Button.tsx";
import {ChangeEvent} from "react";

type Props = {
  task: TaskType
  deleteTask: (taskId: string) => void
  changeTaskStatus: (taskId: string, isDone: boolean) => void
}

export const Task = ({task, deleteTask, changeTaskStatus}: Props) => {

  const deleteTaskHandler = () => {
    deleteTask(task.id)
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    changeTaskStatus(task.id, e.currentTarget.checked)
  }

  return (
    <li>
      <input type="checkbox" checked={task.isDone} onChange={changeTaskStatusHandler}/>
      <span>{task.title}</span>
      <Button title="x" onClick={deleteTaskHandler}/>
    </li>
  );
};
