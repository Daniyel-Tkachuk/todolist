export type Task = {
	id: string
	title: string
	isDone: boolean
}

export type TasksState = {
	[key: string]: Task[]
}