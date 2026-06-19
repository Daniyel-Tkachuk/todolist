import {instance} from "@/common/instance"
import {DomainTask, GetTasksResponse, type UpdateTaskModel} from "@/features/todolists/api/tasksApi.types"
import {BaseResponse} from "@/common/types"

export const tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
  },
  createTask({todolistId, title}: CreateTaskArgs) {
    return instance.post<BaseResponse<{item: DomainTask}>>(`/todo-lists/${todolistId}/tasks`, {title})
  },
  deleteTask({todolistId, taskId}: DeleteTaskArgs) {
    return instance.delete<BaseResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },
  updateTask({todolistId, taskId, domainModel}: UpdateTaskArgs) {
    return instance.put<BaseResponse<{item: DomainTask}>>(`/todo-lists/${todolistId}/tasks/${taskId}`, domainModel)
  },
}

type CreateTaskArgs = {
  todolistId: string
  title: string
}

type DeleteTaskArgs = {
  todolistId: string
  taskId: string
}

type UpdateTaskArgs = {
  todolistId: string
  taskId: string
  domainModel: UpdateTaskModel
}
