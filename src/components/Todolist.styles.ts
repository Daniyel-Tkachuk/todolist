import { SxProps } from "@mui/material"

export const filterButtonsBox: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  gap: '5px',
  mt: '20px'
}

export const getListItemSx = (isDone: boolean): SxProps => ({
  justifyContent: "space-between",
  p: "0",
  opacity: isDone ? .5 : 1,
})