// React Imports
import React, { FC } from "react";
import { ProviderContext } from "notistack";
import { useClosableSnackbar } from "../Hooks";

// Redux Imports
import { getPopupOpen, getPopupType, getUser, togglePopup } from "../Redux";
import { AppDispatch, useAppDispatch } from "../Store";
import { useSelector } from "react-redux";

// Firebase Imports
import firebase from "firebase/app";
import { StyledFirebaseAuth } from "react-firebaseui";
import { ExtendedFirebaseInstance, useFirebase } from "react-redux-firebase";

// Material UI Imports
import {
  makeStyles,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  redButton: {
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
  check: {
    fontSize: "1rem",
  },
}));

const Popup: FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const firebaseInstance = useFirebase();
  const snackbar = useClosableSnackbar();

  const user = useSelector(getUser);
  const open = useSelector(getPopupOpen);
  const type = useSelector(getPopupType);

  const props = {
    open,
    dispatch,
    firebaseInstance,
    snackbar,
    classes,
  };

  switch (type) {
    case "login": {
      if (!user.isEmpty && open) dispatch(togglePopup(false));

      return <LoginPopup {...props} />;
    }
    case "logout": {
      if (user.isEmpty && open) dispatch(togglePopup(false));

      return <LogoutPopup {...props} />;
    }
  }
};

interface PopupProps {
  open: boolean;
  dispatch: AppDispatch;
  firebaseInstance: ExtendedFirebaseInstance;
  snackbar: ProviderContext;
  classes: ReturnType<typeof useStyles>;
}

const LoginPopup: FC<PopupProps> = ({
  open,
  dispatch,
  firebaseInstance,
  snackbar,
}) => (
  <Dialog open={open} onClose={() => dispatch(togglePopup(false))}>
    <DialogTitle>Sign in with Google</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Signing in with Google allows you to create and like questions!
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <StyledFirebaseAuth
        firebaseAuth={firebaseInstance.auth()}
        uiConfig={{
          signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
          signInFlow: "popup",
          callbacks: {
            signInSuccessWithAuthResult(result) {
              const isNew = result.additionalUserInfo.isNewUser;
              if (isNew) {
                const name = result.additionalUserInfo.profile.name;
                snackbar.enqueueSnackbar(`Welcome to AP Questions, ${name}!`, {
                  variant: "default",
                  autoHideDuration: 6000,
                });
              }
              return true;
            },
            async signInFailure(err) {
              snackbar.enqueueSnackbar(err.toString(), {
                variant: "error",
                autoHideDuration: 4000,
              });
            },
          },
        }}
      />
    </DialogActions>
  </Dialog>
);

const LogoutPopup: FC<PopupProps> = ({
  open,
  dispatch,
  firebaseInstance,
  snackbar,
  classes,
}) => (
  <Dialog open={open} onClose={() => dispatch(togglePopup(false))}>
    <DialogTitle>Confirm Logout</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Your data will be preserved, but you will not be able to create or like
        questions.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        variant="contained"
        className={classes.redButton}
        onClick={() =>
          firebaseInstance
            .logout()
            .then(() =>
              snackbar.enqueueSnackbar("Successfully logged out", {
                variant: "success",
                autoHideDuration: 4000,
              })
            )
            .catch((err) => {
              snackbar.enqueueSnackbar(
                typeof err.toString() === "string"
                  ? err.toString()
                  : "Error logging out",
                {
                  variant: "error",
                  autoHideDuration: 4000,
                }
              );
            })
        }
      >
        Logout
      </Button>
    </DialogActions>
  </Dialog>
);

export default Popup;
