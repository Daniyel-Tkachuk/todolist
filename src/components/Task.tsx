import {TaskType} from "../App.tsx";

type Props = {
  task: TaskType
  deleteTask: (taskId: number) => void
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
