import './App.css'
import {TodolistItem} from "./components/TodolistItem.tsx";
import type {Task} from "./types.ts";
import {useState} from "react";
import {v1} from "uuid";


export type FilterValues = 'all' | 'active' | 'completed'

function App() {
	const todolistTitle1 = 'What to learn?'

	const [tasks, setTasks] = useState<Task[]>([
		{id: v1(), title: 'HTML & CSS', isDone: true},
		{id: v1(), title: "JavaScript", isDone: true},
		{id: v1(), title: "React", isDone: false},
		{id: v1(), title: "Redux", isDone: false},
		{id: v1(), title: "TypeScript", isDone: false},
		{id: v1(), title: "RTK query", isDone: true},
	])

	// const [filter, setFilter] = useState<FilterValues>('all')

	const deleteTask = (taskId: string) => {
		setTasks(tasks.filter(task => task.id !== taskId))
	}

	const createTask = (title: string) => {
		const newTask = {id: v1(), title, isDone: false}
		setTasks([newTask, ...tasks])
	}

	const changeTaskStatus = (taskId: string, isDone: boolean) => {
		setTasks(tasks.map(t => t.id === taskId ? {...t, isDone} : t))
	}

	/*const changeFilter = (filter: FilterValues) => {
		setFilter(filter)
	}

	let filteredTasks = tasks
	if (filter === 'active') {
		filteredTasks = tasks.filter(task => !task.isDone)
	}
	if (filter === 'completed') {
		filteredTasks = tasks.filter(task => task.isDone)
	}*/


	return (
		<div className="app">
			<TodolistItem
				title={todolistTitle1}
				tasks={tasks}
				deleteTask={deleteTask}
				createTask={createTask}
				changeTaskStatus={changeTaskStatus}
			/>
		</div>
	)
}

export default App
