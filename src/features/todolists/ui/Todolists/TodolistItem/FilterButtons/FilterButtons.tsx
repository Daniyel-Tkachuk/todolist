import {changeTodolistFilter, FilterValues, DomainTodolist} from "@/features/todolists/model/todolists-slice.ts"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import {useAppDispatch} from "@/common/hooks"
import {containerSx} from "@/common/styles"

type Props = {
  todolist: DomainTodolist
}

export const FilterButtons = ({todolist}: Props) => {
  const {id, filter} = todolist

  const dispatch = useAppDispatch()

  const changeFilter = (filter: FilterValues) => {
    dispatch(changeTodolistFilter({id, filter}))
  }

  return (
    <Box sx={containerSx}>
      <Button variant={filter === "all" ? "outlined" : "text"} color={"inherit"} onClick={() => changeFilter("all")}>
        All
      </Button>
      <Button
        variant={filter === "active" ? "outlined" : "text"}
        color={"primary"}
        onClick={() => changeFilter("active")}
      >
        Active
      </Button>
      <Button
        variant={filter === "completed" ? "outlined" : "text"}
        color={"secondary"}
        onClick={() => changeFilter("completed")}
      >
        Completed
      </Button>
    </Box>
  )
}
