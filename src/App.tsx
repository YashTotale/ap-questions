//React Imports
import { hot } from "react-hot-loader";
import React, { FC } from "react";
import { Switch, Route } from "react-router-dom";

// Pages
import Home from "./Pages/Home";
import Create from "./Pages/Create";

// Components
import Popup from "./Components/Popup";
import Navbar from "./Components/Navbar";

// Redux Imports
import { useSelector } from "react-redux";
import { getCourses, getCoursesLoading, getUsersLoading } from "./Redux";

// Firebase Imports
import { useFirestoreConnect } from "react-redux-firebase";

// Material UI Imports
import { CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  app: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingSpinner: {
    marginTop: theme.spacing(2),
  },
}));

const App: FC = () => {
  useFirestoreConnect({ collection: "courses" });
  useFirestoreConnect({ collection: "users" });

  return (
    <>
      <Popup />
      <Navbar />
      <Routes />
    </>
  );
};

const Routes: FC = () => {
  const classes = useStyles();

  const coursesLoading = useSelector(getCoursesLoading);
  const courses = useSelector(getCourses);

  const usersLoading = useSelector(getUsersLoading);

  return (
    <div className={classes.app}>
      {coursesLoading || !courses || usersLoading ? (
        <CircularProgress className={classes.loadingSpinner} />
      ) : (
        <Switch>
          <Route path="/create">
            <Create />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      )}
    </div>
  );
};

//Hot Loader reloads the app when you save changes
export default hot(module)(App);
