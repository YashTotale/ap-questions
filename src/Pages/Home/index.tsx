//React Imports
import React, { FC } from "react";
import Filters from "./Filters";
import Questions from "./Questions";

// Redux Imports
import { useSelector } from "react-redux";
import { getCourses, getCoursesLoading } from "../../Redux";

// Firebase Imports
import { useFirestoreConnect } from "react-redux-firebase";

//Material UI Imports
import { CircularProgress, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  loadingSpinner: {
    marginTop: theme.spacing(2),
  },
  home: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    margin: "auto",
    padding: theme.spacing(3),

    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
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
        <>
          <Filters />
          <Questions />
        </>
      )}
    </div>
  );
};

export default Home;
