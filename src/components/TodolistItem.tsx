import type {Task} from "../types.ts";
import {Button} from "./Button.tsx";
import type {FilterValues} from "../App.tsx";
import {type ChangeEvent, useState, type KeyboardEvent} from "react";

type Props = {
	title: string
	tasks: Task[]
	deleteTask: (taskId: string) => void
	createTask: (title: string) => void
}

export const TodolistItem = (props: Props) => {
	const {
		title,
		tasks,
		deleteTask,
		createTask,
	} = props

	const [filter, setFilter] = useState<FilterValues>('all')
	const [taskTitle, setTaskTitle] = useState('')

	const changeTaskTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
		setTaskTitle(e.currentTarget.value)
	}

	const changeFilter = (filter: FilterValues) => {
		setFilter(filter)
	}

	const createTaskHandler = () => {
		createTask(taskTitle)
		setTaskTitle('')
	}

	const createTaskOnEnterHandler = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			createTaskHandler()
		}
	}

	const filteredTasks = tasks.filter(task => {
		if (filter === 'active') return !task.isDone
		if (filter === 'completed') return task.isDone
		return true
	})


	const mappedTask = filteredTasks.map((task) => {
		const deleteTaskHandler = () => {
			deleteTask(task.id)
		}
		return (
			<li key={task.id}>
				<Button title='X' onClick={deleteTaskHandler}/>
				<input type="checkbox" checked={task.isDone}/>
				<span>{task.title}</span>
			</li>
		)
	})

	return (
		<div>
			<h3>{title}</h3>
			<div>
				<input value={taskTitle}
				       onChange={changeTaskTitleHandler}
				       onKeyDown={createTaskOnEnterHandler}
				/>
				<Button title="+"
				        onClick={createTaskHandler}
				/>
			</div>
			{
				tasks.length === 0
					? <span>Your tasksList is empty</span>
					: <ul>{mappedTask}</ul>
			}
			<div>
				<Button
					title="All"
					onClick={() => changeFilter('all')}
					className={filter === 'all' ? 'activeButton' : ''}
				/>
				<Button
					title="Active"
					className={filter === 'active' ? 'activeButton' : ''}
					onClick={() => changeFilter('active')}
				/>
				<Button
					title="Completed"
					onClick={() => changeFilter('completed')}
					className={filter === 'completed' ? 'activeButton' : ''}
				/>
			</div>
		</div>
	);
};
