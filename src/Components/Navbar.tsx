// React Imports
import React, { FC, useState } from "react";

// Redux Imports
import { useDispatch, useSelector } from "react-redux";
import { getUser, toggleDarkMode } from "../Redux";
import { AppDispatch } from "../Store";

// Firebase Imports
import { togglePopup } from "../Redux";
import { FirebaseReducer } from "react-redux-firebase";

// Material UI Imports
import {
  makeStyles,
  AppBar,
  IconButton,
  Toolbar,
  Tooltip,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  CircularProgress,
} from "@material-ui/core";
import { Brightness7, Brightness4, Person } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  toolbar: {},
  icon: {
    fontSize: "1.75rem",
  },
  avatar: {
    cursor: "pointer",
  },
}));

const Navbar: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector(getUser);

  const isDarkMode = theme.palette.type === "dark";

  return (
    <AppBar elevation={2} color="transparent" position="static">
      <Toolbar className={classes.toolbar}>
        <Tooltip title={`Toggle ${isDarkMode ? "Light" : "Dark"} Theme`}>
          <IconButton
            onClick={() => {
              dispatch(toggleDarkMode());
            }}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Tooltip>
        {!user.isLoaded ? (
          <CircularProgress />
        ) : user.isEmpty ? (
          <LoginButton dispatch={dispatch} classes={classes} />
        ) : (
          <ProfileMenu dispatch={dispatch} user={user} classes={classes} />
        )}
      </Toolbar>
    </AppBar>
  );
};

interface LoginButtonProps {
  dispatch: AppDispatch;
  classes: ReturnType<typeof useStyles>;
}

const LoginButton: FC<LoginButtonProps> = ({ dispatch, classes }) => {
  return (
    <Tooltip title="Login">
      <IconButton
        onClick={() => dispatch(togglePopup({ open: true, type: "login" }))}
      >
        <Person className={classes.icon} />
      </IconButton>
    </Tooltip>
  );
};

interface ProfileMenuProps {
  user: FirebaseReducer.AuthState;
  dispatch: AppDispatch;
  classes: ReturnType<typeof useStyles>;
}

const ProfileMenu: FC<ProfileMenuProps> = ({ user, dispatch, classes }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title="Profile">
        <Avatar
          alt={user.displayName ?? "Profile Picture"}
          src={user.photoURL ?? undefined}
          variant="circular"
          className={classes.avatar}
          onClick={handleClick}
        />
      </Tooltip>
      <Menu
        elevation={6}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuItem
          onClick={() => {
            dispatch(togglePopup({ type: "logout", open: true }));
            handleClose();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
