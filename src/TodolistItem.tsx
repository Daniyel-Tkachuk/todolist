import type {ChangeEvent} from 'react'
import {CreateItemForm} from './CreateItemForm'
import {EditableSpan} from './EditableSpan'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import {containerSx, getListItemSx} from './TodolistItem.styles'
import {
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  deleteTodolistAC,
  FilterValues,
  Todolist
} from "@/model/todolists-reducer.ts";
import {changeTaskStatusAC, changeTaskTitleAC, createTaskAC, deleteTaskAC} from "@/model/tasks-reducer.ts";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";
import {useAppSelector} from "@/common/hooks/useAppSelector.ts";
import {selectTasks} from "@/model/tasks-selectors.ts";

type Props = {
  todolist: Todolist
}

export const TodolistItem = ({todolist}: Props) => {
  const {id, title, filter} = todolist

  const tasks = useAppSelector(selectTasks)
  const dispatch = useAppDispatch()

  let filteredTasks = tasks[id]
  if (todolist.filter === 'active') {
    filteredTasks = filteredTasks.filter(task => !task.isDone)
  }
  if (todolist.filter === 'completed') {
    filteredTasks = filteredTasks.filter(task => task.isDone)
  }


  const changeFilter = (filter: FilterValues) => {
    dispatch(changeTodolistFilterAC({id, filter}))
  }

  const deleteTodolist = () => {
    dispatch(deleteTodolistAC({id}))
  }

  const changeTodolistTitle = (title: string) => {
    dispatch(changeTodolistTitleAC({id, title}))
  }

  const createTask = (title: string) => {
    dispatch(createTaskAC({todolistId: id, title}))
  }

  const deleteTask = (taskId: string) => {
    dispatch(deleteTaskAC({todolistId: id, taskId}))
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>, taskId: string) => {
    const newStatusValue = e.currentTarget.checked
    dispatch(changeTaskStatusAC({todolistId: id, taskId, isDone: newStatusValue}))
  }

  const changeTaskTitle = (taskId: string, title: string) => {
    dispatch(changeTaskTitleAC({todolistId: id, taskId, title}))
  }

  return (
    <div>
      <div className={'container'}>
        <h3>
          <EditableSpan value={title} onChange={changeTodolistTitle}/>
        </h3>
        <IconButton onClick={deleteTodolist}>
          <DeleteIcon/>
        </IconButton>
      </div>
      <CreateItemForm onCreateItem={createTask}/>
      {filteredTasks.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {filteredTasks.map(task => {
            return (
              <ListItem key={task.id} sx={getListItemSx(task.isDone)}>
                <div>
                  <Checkbox checked={task.isDone} onChange={(e) => changeTaskStatus(e, task.id)}/>
                  <EditableSpan value={task.title} onChange={(title) => changeTaskTitle(task.id, title)}/>
                </div>
                <IconButton onClick={() => deleteTask(task.id)}>
                  <DeleteIcon/>
                </IconButton>
              </ListItem>
            )
          })}
        </List>
      )}
      <Box sx={containerSx}>
        <Button variant={filter === 'all' ? 'outlined' : 'text'}
                color={'inherit'}
                onClick={() => changeFilter('all')}>
          All
        </Button>
        <Button variant={filter === 'active' ? 'outlined' : 'text'}
                color={'primary'}
                onClick={() => changeFilter('active')}>
          Active
        </Button>
        <Button variant={filter === 'completed' ? 'outlined' : 'text'}
                color={'secondary'}
                onClick={() => changeFilter('completed')}>
          Completed
        </Button>
      </Box>
    </div>
  )
}
