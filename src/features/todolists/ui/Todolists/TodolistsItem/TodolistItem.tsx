import {CreateItemForm} from "@/common/components/CreateItemForm/CreateItemForm.tsx";
import {Todolist} from "@/features/todolists/model/todolists-reducer.ts";
import {createTaskAC} from "@/features/todolists/model/tasks-reducer.ts";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";
import {TodolistTitle} from "@/features/todolists/ui/Todolists/TodolistsItem/TodolistsTitle/TodolistTitle.tsx";
import {Tasks} from "@/features/todolists/ui/Todolists/TodolistsItem/Tasks/Tasks.tsx";
import {FilterButtons} from "@/features/todolists/ui/Todolists/TodolistsItem/FilterButtons/FilterButtons.tsx";


type Props = {
  todolist: Todolist
}

export const TodolistItem = ({todolist}: Props) => {
  const {id} = todolist

  const dispatch = useAppDispatch()

  const createTask = (title: string) => {
    dispatch(createTaskAC({todolistId: id, title}))
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
