import {TaskType} from "../App.tsx";
import {Button} from "./Button.tsx";

type Props = {
  task: TaskType
  deleteTask: (taskId: string) => void
}

export const Task = ({task, deleteTask}: Props) => {

  const deleteTaskHandler = () => {
    deleteTask(task.id)
  }

  return (
    <li>
      <input type="checkbox" checked={task.isDone}/>
      <span>{task.title}</span>
      <Button title="x" onClick={deleteTaskHandler}/>
    </li>
  );
};
