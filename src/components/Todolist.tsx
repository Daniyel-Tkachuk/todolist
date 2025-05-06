import {TaskType} from "../App.tsx";
import {Button} from "./Button.tsx";
import {Task} from "./Task.tsx";

type Props = {
  title: string
  tasks: TaskType[]
}

export const Todolist = ({tasks, title}: Props) => {
  const mappedTasks = tasks.map(t => {
    return (
      <Task key={t.id} task={t}/>
    )
  })

  return (
    <div>
      <h3>{title}</h3>
      <div>
        <input/>
        <button>+</button>
      </div>
      {
        tasks.length === 0
          ? <p>Тасок нет</p>
          : <ul>
            {mappedTasks}
          </ul>
      }
      <div>
        <Button title={"all"}/>
        <Button title={"active"}/>
        <Button title={"completed"}/>
      </div>
    </div>
  )
    ;
};

