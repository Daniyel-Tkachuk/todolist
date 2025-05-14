import {FilterTasks, TaskType} from "../App.tsx";
import {Button} from "./Button.tsx";
import {Task} from "./Task.tsx";

type Props = {
  title: string
  tasks: TaskType[]
  filter: FilterTasks
  deleteTask: (taskId: number) => void
  changeFilter: (filter: FilterTasks) => void
}

export const Todolist = ({tasks, title, deleteTask, filter, changeFilter}: Props) => {


  let filteredTasks = tasks
  if (filter === "active") {
    filteredTasks = tasks.filter((task) => !task.isDone)
  }
  if (filter === "completed") {
    filteredTasks = tasks.filter((task) => task.isDone)
  }

  const mappedTasks = filteredTasks.map(t => {
    return (
      <Task key={t.id} task={t} deleteTask={deleteTask}/>
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
        filteredTasks.length === 0
          ? <p>Тасок нет</p>
          : <ul>
            {mappedTasks}
          </ul>
      }
      <div>
        <Button title={"all"} onClick={() => changeFilter("all")}/>
        <Button title={"active"} onClick={() => changeFilter("active")}/>
        <Button title={"completed"} onClick={() => changeFilter("completed")}/>
      </div>
    </div>
  );
};

