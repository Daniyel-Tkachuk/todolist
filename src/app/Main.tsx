import Grid from "@mui/material/Grid2"
import {CreateItemForm} from "@/common/components/CreateItemForm/CreateItemForm.tsx"
import Container from "@mui/material/Container"
import {Todolists} from "@/features/todolists/ui/Todolists/Todolists.tsx"
import {useAppDispatch} from "@/common/hooks"
import {createTodolistTC} from "@/features/todolists/model/todolists-slice"

export const Main = () => {
  const dispatch = useAppDispatch()

  const createTodolistHandler = (title: string) => {
    dispatch(createTodolistTC(title))
  }

  return (
    <Container maxWidth={"lg"}>
      <Grid container sx={{mb: "30px"}}>
        <CreateItemForm onCreateItem={createTodolistHandler} />
      </Grid>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
