//React Imports
import React, { FC } from "react";

// Redux Imports
import { useSelector } from "react-redux";
import { getCourses, getCoursesLoading } from "../Redux";

// Firebase Imports
import { useFirestoreConnect } from "react-redux-firebase";

//Material UI Imports
import { CircularProgress, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  home: {
    display: "flex",
    justifyContent: "center",
  },
  loadingSpinner: {
    marginTop: theme.spacing(2),
  },
}));

const Home: FC = () => {
  useFirestoreConnect({ collection: "courses" });

  const classes = useStyles();
  const coursesLoading = useSelector(getCoursesLoading);
  const courses = useSelector(getCourses);

  return (
    <div className={classes.home}>
      {coursesLoading || !courses ? (
        <CircularProgress className={classes.loadingSpinner} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Home;
