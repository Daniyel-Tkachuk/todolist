import {CreateItemForm} from "@/common/components/CreateItemForm/CreateItemForm.tsx"
import {Todolist} from "@/features/todolists/model/todolists-slice.ts"
import {createTask} from "@/features/todolists/model/tasks-slice.ts"
import {TodolistTitle} from "./TodolistTitle/TodolistTitle.tsx"
import {Tasks} from "./Tasks/Tasks.tsx"
import {FilterButtons} from "./FilterButtons/FilterButtons.tsx"
import {useAppDispatch} from "@/common/hooks"

type Props = {
  todolist: Todolist
}

export const TodolistItem = ({todolist}: Props) => {
  const {id} = todolist

  const dispatch = useAppDispatch()

  const createTaskHandler = (title: string) => {
    dispatch(createTask({todolistId: id, title}))
  }

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <CreateItemForm onCreateItem={createTaskHandler} />
      <Tasks todolist={todolist} />
      <FilterButtons todolist={todolist} />
    </div>
  )
}
