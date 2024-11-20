import { configureStore } from '@reduxjs/toolkit'
import DarkModeReducer from '../redux/DarkModeSlice'
import loaderReducer from './LoaderSlice'

const store = configureStore({
  reducer: {
    darkMode: DarkModeReducer,
    loader: loaderReducer
  },
})

export default store