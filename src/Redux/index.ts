import { FirebaseReducer } from "react-redux-firebase";
import { RootState } from "../Store";

/**
 * Firebase
 */

export const getUser = (state: RootState): FirebaseReducer.AuthState =>
  state.firebase.auth;

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
