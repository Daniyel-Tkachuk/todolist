import {instance} from "@/common/instance"
import {Todolist} from "@/features/todolists/api/todolistsApi.types"
import {BaseResponse} from "@/common/types"

export const todolistsApi = {
  getTodolists() {
    return instance.get<Todolist[]>("/todo-lists")
  },
  createTodolist(title: string) {
    return instance.post<BaseResponse<{item: Todolist}>>("/todo-lists", {title})
  },
  deleteTodolist(id: string) {
    return instance.delete<BaseResponse>(`/todo-lists/${id}`)
  },
  changeTodolistTitle(payload: UpdateTodolist) {
    const {id, title} = payload
    return instance.put<BaseResponse>(`1/todo-lists/${id}`, {title})
  },
}

type UpdateTodolist = {
  id: string
  title: string
}
