import type {Task} from "../types.ts";
import {Button} from "./Button.tsx";
import type {FilterValues} from "../App.tsx";
import {type ChangeEvent, useState, type KeyboardEvent} from "react";

type Props = {
	title: string
	tasks: Task[]
	deleteTask: (taskId: string) => void
	createTask: (title: string) => void
	changeTaskStatus: (taskId: string, isDone: boolean) => void
}

export const TodolistItem = (props: Props) => {
	const {
		title,
		tasks,
		deleteTask,
		createTask,
		changeTaskStatus,
	} = props

	const [filter, setFilter] = useState<FilterValues>('all')
	const [taskTitle, setTaskTitle] = useState('')
	const [error, setError] = useState<string | null>(null)

	const changeTaskTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
		setTaskTitle(e.currentTarget.value)
		setError(null)
	}

	const changeFilter = (filter: FilterValues) => {
		setFilter(filter)
	}

	const createTaskHandler = () => {
		const trimmedTitle = taskTitle.trim()
		if (trimmedTitle !== '') {
			createTask(trimmedTitle)
		} else {
			setError('Title is required')
		}
		setTaskTitle('')
	}

	const createTaskOnEnterHandler = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			createTaskHandler()
		}
	}

	const deleteTaskHandler = (taskId: string) => {
		deleteTask(taskId)
	}

	const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>, taskId: string) => {
		const taskStatus = e.currentTarget.checked
		changeTaskStatus(taskId, taskStatus)
	}

	const filteredTasks = tasks.filter(task => {
		if (filter === 'active') return !task.isDone
		if (filter === 'completed') return task.isDone
		return true
	})


	const mappedTask = filteredTasks.map((task) => {

		return (
			<li key={task.id} className={task.isDone ? 'is-Done' : ''}>
				<Button title='X' onClick={() => deleteTaskHandler(task.id)}/>
				<input type="checkbox" checked={task.isDone} onChange={(e) => changeTaskStatusHandler(e, task.id)}/>
				<span>{task.title}</span>
			</li>
		)
	})

	return (
		<div>
			<h3>{title}</h3>
			<div>
				<input
					value={taskTitle}
					className={error ? 'error' : ''}
					onChange={changeTaskTitleHandler}
					onKeyDown={createTaskOnEnterHandler}
				/>
				<Button title="+" onClick={createTaskHandler} />
				{error && <div className='error-message'>{error}</div>}
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
					className={filter === 'all' ? 'activeFilter' : ''}
				/>
				<Button
					title="Active"
					className={filter === 'active' ? 'activeFilter' : ''}
					onClick={() => changeFilter('active')}
				/>
				<Button
					title="Completed"
					onClick={() => changeFilter('completed')}
					className={filter === 'completed' ? 'activeFilter' : ''}
				/>
			</div>
		</div>
	);
};
