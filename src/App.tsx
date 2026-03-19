import './App.css'
import {TodolistItem} from "./components/TodolistItem.tsx";
import type {Task} from "./types.ts";
import {useState} from "react";
import {v1} from "uuid";


export type FilterValues = 'all' | 'active' | 'completed'

function App() {
	const todolistTitle1 = 'What to learn?'

	const [tasks, setTasks] = useState<Task[]>([
		{id: v1(), title: 'HTML & CSS', isDone: false},
		{id: v1(), title: "JavaScript", isDone: false},
		{id: v1(), title: "React", isDone: false},
		{id: v1(), title: "Redux", isDone: false},
		{id: v1(), title: "TypeScript", isDone: false},
		{id: v1(), title: "RTK query", isDone: false},
	])

	// const [filter, setFilter] = useState<FilterValues>('all')

	const deleteTask = (taskId: string) => {
		setTasks(tasks.filter(task => task.id !== taskId))
	}

	const createTask = (title: string) => {
		const newTask = {id: v1(), title, isDone: false}
		setTasks([newTask, ...tasks])
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
			/>
		</div>
	)
}

export default App
