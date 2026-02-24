import doctorSlice from "@/ReduxSlices/doctorSlice"
import { configureStore } from "@reduxjs/toolkit"

const store = configureStore({
  reducer: {
    doctors: doctorSlice,
  },
})

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch