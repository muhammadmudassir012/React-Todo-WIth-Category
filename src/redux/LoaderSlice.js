import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
    isLoading: false
}

const LoaderSlice = createSlice({
    name: 'loader',
    initialState: initialstate,
    reducers: {
        loadingStart: (state) => {
            state.isLoading = true
        },
        loadingStop: (state) => {
            state.isLoading = false
        }
    }
})

export default LoaderSlice.reducer
export const {loadingStart,loadingStop} = LoaderSlice.actions   