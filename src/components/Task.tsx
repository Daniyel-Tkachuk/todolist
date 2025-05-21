import {TaskType} from "../App.tsx";

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
      <button onClick={deleteTaskHandler}>x</button>
    </li>
  );
};
