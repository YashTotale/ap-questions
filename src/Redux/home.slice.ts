import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Store";

export interface HomeState {
  course: string | null;
}

export const initialHomeState: HomeState = {
  course: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState: initialHomeState,
  reducers: {
    changeCourse: (state, action: PayloadAction<HomeState["course"]>) => ({
      ...state,
      course: action.payload,
    }),
  },
});

// Actions
export const { changeCourse } = homeSlice.actions;

// Selectors
export const getSelectedCourse = (state: RootState): HomeState["course"] =>
  state.home.course;

// Reducer
export const homeReducer = homeSlice.reducer;

export default homeSlice;
