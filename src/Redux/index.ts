import { FirebaseReducer, TypeWithId } from "react-redux-firebase";
import { Course, RootState, Profile } from "../Store";

/**
 * Firebase
 */

export const getUser = (state: RootState): FirebaseReducer.AuthState =>
  state.firebase.auth;

export const getCoursesLoading = (state: RootState): boolean =>
  state.firestore.status.requesting.courses;

export const getCourses = (state: RootState): TypeWithId<Course>[] =>
  state.firestore.ordered.courses;

export const getUsersLoading = (state: RootState): boolean =>
  state.firestore.status.requesting.users;

export const getUsers = (state: RootState): Record<string, Profile> =>
  state.firestore.data.users;

/**
 * Display Slice
 */

export {
  // -> Slice
  default as displaySlice,
  // -> Selectors
  getIsDarkMode,
  // -> Actions
  toggleDarkMode,
  // -> Reducer
  displayReducer,
  // -> State
  initialDisplayState,
} from "./display.slice";

export type { DisplayState } from "./display.slice";

/**
 * Popup Slice
 */

export {
  // -> Slice
  default as popupSlice,
  // -> Selectors
  getPopupOpen,
  getPopupType,
  // -> Actions
  togglePopup,
  setPopupType,
  // -> Reducer
  popupReducer,
  // -> State
  initialPopupState,
} from "./popup.slice";

export type { PopupState } from "./popup.slice";

/**
 * Home Slice
 */

export {
  // -> Slice
  default as homeSlice,
  // -> Selectors
  getSelectedCourse,
  // -> Actions
  changeCourse,
  // -> Reducer
  homeReducer,
  // -> State
  initialHomeState,
} from "./home.slice";

export type { HomeState } from "./home.slice";
