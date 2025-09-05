import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit"


// обертка над createSlice, для того, чтобы создавать thunks внутри слайсов
export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
})
