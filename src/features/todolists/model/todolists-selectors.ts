import type { RootState } from "@/app/store"
import type { Todolist } from "./todolistsSlice.ts"

export const selectTodolists = (state: RootState): Todolist[] => state.todolists
