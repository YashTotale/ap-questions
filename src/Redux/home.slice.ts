import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Store";

export const orders = [
  "mostRecent",
  "oldest",
  "mostLikes",
  "leastLikes",
] as const;

export interface HomeState {
  course: string | null;
  orderBy: typeof orders[number];
}

export const initialHomeState: HomeState = {
  course: null,
  orderBy: "mostRecent",
};

const homeSlice = createSlice({
  name: "home",
  initialState: initialHomeState,
  reducers: {
    changeCourse: (state, action: PayloadAction<HomeState["course"]>) => ({
      ...state,
      course: action.payload,
    }),
    changeOrderBy: (state, action: PayloadAction<HomeState["orderBy"]>) => ({
      ...state,
      orderBy: action.payload,
    }),
  },
});

// Actions
export const { changeCourse, changeOrderBy } = homeSlice.actions;

// Selectors
export const getSelectedCourse = (state: RootState): HomeState["course"] =>
  state.home.course;

export const getOrderBy = (state: RootState): HomeState["orderBy"] =>
  state.home.orderBy;

// Reducer
export const homeReducer = homeSlice.reducer;

export default homeSlice;
