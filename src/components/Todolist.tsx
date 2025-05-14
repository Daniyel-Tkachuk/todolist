import {FilterTasks, TaskType} from "../App.tsx";
import {Button} from "./Button.tsx";
import {Task} from "./Task.tsx";
import {useState} from "react";

type Props = {
  title: string
  tasks: TaskType[]
  deleteTask: (taskId: number) => void
}

export const Todolist = ({tasks, title, deleteTask}: Props) => {

  const [filter, setFilter] = useState<FilterTasks>("all")

  const getFilteredTasks = () => {
    switch (filter) {
      case "active": {
        return tasks.filter((task) => !task.isDone)
      }
      case "completed": {
        return tasks.filter((task) => task.isDone)
      }
      default: {
        return tasks
      }
    }
  }


  const mappedArrTasks = getFilteredTasks().map(t => {
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
        mappedArrTasks.length === 0
          ? <p>Тасок нет</p>
          : <ul>
            {mappedArrTasks}
          </ul>
      }
      <div>
        <Button title={"all"} onClick={() => setFilter("all")}/>
        <Button title={"active"} onClick={() => setFilter("active")}/>
        <Button title={"completed"} onClick={() => setFilter("completed")}/>
      </div>
    </div>
  );
};

