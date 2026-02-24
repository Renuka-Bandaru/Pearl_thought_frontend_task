import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export interface Doctor {
  id: number
  name: string
  specialty: string
  qualification: string
  fellowship: string
  description: string
  patients: string
  experience: string
  rating: string
  reviews: string
  service: string
  availabilityDays: string
  availabilityTime: string
  phone: string
}

interface DoctorState {
  doctors: Doctor[]
  loading: boolean
  error: string | null
}

const initialState: DoctorState = {
  doctors: [],
  loading: false,
  error: null,
}

export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async () => {
    const response = await fetch(
      "https://mocki.io/v1/d0c82e3a-3409-4881-be97-1f743a906cd6"
    )
    return response.json()
  }
)

const doctorSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false
        state.doctors = action.payload
      })
      .addCase(fetchDoctors.rejected, (state) => {
        state.loading = false
        state.error = "Failed to fetch doctors"
      })
  },
})

export default doctorSlice.reducer