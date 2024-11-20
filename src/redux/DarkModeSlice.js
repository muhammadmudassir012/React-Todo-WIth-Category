import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    mode: true
}

// JSON.parse(localStorage.getItem('darkMode')) ||
export const DarkModeSlice = createSlice({
  name: 'darkMode',
  initialState: initialState,
  reducers: {
    toggleDarkMode: (state) => {
        state.mode = !state.mode;
        localStorage.setItem('darkMode',JSON.stringify(state.mode))
    }
  },
})

// Action creators are generated for each case reducer function
export const { toggleDarkMode } = DarkModeSlice.actions

export default DarkModeSlice.reducer