import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const fetchAllFaculties = createAsyncThunk('faculty/fetchAll', async () => {
  const res = await API.get('/faculty');
  return res.data.data;
});

export const addFacultyRecord = createAsyncThunk('faculty/add', async (form) => {
  const res = await API.post('/faculty', form);
  return res.data.data;
});

export const purgeFacultyRecord = createAsyncThunk('faculty/purge', async (id) => {
  await API.delete(`/faculty/${id}`);
  return id;
});

const facultySlice = createSlice({
  name: 'faculty',
  initialState: { faculties: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFaculties.fulfilled, (state, action) => { state.faculties = action.payload; })
      .addCase(addFacultyRecord.fulfilled, (state, action) => { state.faculties.unshift(action.payload); })
      .addCase(purgeFacultyRecord.fulfilled, (state, action) => { state.faculties = state.faculties.filter(f => f._id !== action.payload); });
  }
});
export default facultySlice.reducer;