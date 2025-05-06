import {TaskType} from "../App.tsx";

type Props = {
  task: TaskType
}

export const Task = ({task}: Props) => {
  return (
    <li>
      <input type="checkbox" checked={task.isDone}/>
      <span>{task.title}</span>
    </li>
  );
};
