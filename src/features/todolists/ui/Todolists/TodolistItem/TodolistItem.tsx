import {CreateItemForm} from '@/common/components/CreateItemForm/CreateItemForm.tsx'
import {Todolist} from "@/features/todolists/model/todolists-reducer.ts";
import {createTaskAC} from "@/features/todolists/model/tasks-reducer.ts";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";
import {TodolistTitle} from "./TodolistTitle/TodolistTitle.tsx";
import {FilterButtons} from "./FilterButtons/FilterButtons.tsx";
import {Tasks} from "./Tasks/Tasks.tsx";

type Props = {
  todolist: Todolist
}

export const TodolistItem = ({todolist}: Props) => {
  const dispatch = useAppDispatch()

  const createTask = (title: string) => {
    dispatch(createTaskAC({todolistId: todolist.id, title}))
  }

  return (
    <div>
      <TodolistTitle todolist={todolist}/>
      <CreateItemForm onCreateItem={createTask}/>
      <Tasks todolist={todolist}/>
      <FilterButtons todolist={todolist}/>
    </div>
  )
}
