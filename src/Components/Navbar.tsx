// React Imports
import React, { FC, useState } from "react";
import { useHistory } from "react-router";

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
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import {
  Brightness7,
  Brightness4,
  Person,
  Home,
  Add,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    position: "relative",
  },
  heading: {
    margin: "auto",
  },
  pageIcons: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    left: "1%",
  },
  icons: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    right: "1%",
  },
  icon: {
    margin: theme.spacing(0, 0.5),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(1),
      margin: theme.spacing(0, 0),
    },
  },
  iconSVG: {
    fontSize: "1.75rem",
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.4rem",
    },
  },
  avatar: {
    cursor: "pointer",
    marginLeft: theme.spacing(0.5),
    [theme.breakpoints.down("xs")]: {
      width: "30px",
      height: "30px",
    },
  },
}));

const Navbar: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();
  const user = useSelector(getUser);

  const isNotSmall = useMediaQuery(theme.breakpoints.up("sm"));

  const isDarkMode = theme.palette.type === "dark";

  return (
    <AppBar elevation={2} color="transparent" position="static">
      <Toolbar className={classes.toolbar}>
        <div className={classes.pageIcons}>
          <Tooltip title="Home">
            <IconButton
              className={classes.icon}
              onClick={() => history.push("/")}
            >
              <Home className={classes.iconSVG} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Create">
            <IconButton
              className={classes.icon}
              onClick={() => history.push("/create")}
            >
              <Add className={classes.iconSVG} />
            </IconButton>
          </Tooltip>
        </div>
        <Typography
          variant={isNotSmall ? "h4" : "h6"}
          className={classes.heading}
        >
          AP Questions
        </Typography>
        <div className={classes.icons}>
          <Tooltip title={`Toggle ${isDarkMode ? "Light" : "Dark"} Theme`}>
            <IconButton
              onClick={() => {
                dispatch(toggleDarkMode());
              }}
              className={classes.icon}
            >
              {isDarkMode ? (
                <Brightness7 className={classes.iconSVG} />
              ) : (
                <Brightness4 className={classes.iconSVG} />
              )}
            </IconButton>
          </Tooltip>
          {!user.isLoaded ? (
            <CircularProgress className={classes.icon} />
          ) : user.isEmpty ? (
            <LoginButton dispatch={dispatch} classes={classes} />
          ) : (
            <ProfileMenu dispatch={dispatch} user={user} classes={classes} />
          )}
        </div>
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
        className={classes.icon}
      >
        <Person className={classes.iconSVG} />
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
