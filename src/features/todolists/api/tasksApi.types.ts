import {TaskPriority, TaskStatusType} from "@/common/enums"

export type DomainTask = {
  description: string | null
  title: string
  status: TaskStatusType
  priority: TaskPriority
  startDate: string | null
  deadline: string | null
  id: string
  todoListId: string
  order: number
  addedDate: string
}

export type UpdateTaskModel = Omit<DomainTask, "id" | "todoListId" | "order" | "addedDate">

export type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: DomainTask[]
}
