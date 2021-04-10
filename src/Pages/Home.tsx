//React Imports
import React, { FC } from "react";
import ThemedSelect from "../Components/Reusable/ThemedSelect";

// Redux Imports
import { useSelector } from "react-redux";
import {
  changeCourse,
  getCourses,
  getCoursesLoading,
  getSelectedCourse,
} from "../Redux";
import { useAppDispatch } from "../Store";

// Firebase Imports
import { useFirestoreConnect } from "react-redux-firebase";

//Material UI Imports
import { CircularProgress, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  home: {
    display: "flex",
    justifyContent: "center",
    width: "80%",
    margin: "auto",
  },
  loadingSpinner: {
    marginTop: theme.spacing(2),
  },
  filters: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  courseSelect: {
    width: "100%",
  },
}));

const Home: FC = () => {
  useFirestoreConnect({ collection: "courses" });

  const dispatch = useAppDispatch();
  const classes = useStyles();
  const coursesLoading = useSelector(getCoursesLoading);
  const courses = useSelector(getCourses);

  const selectedCourse = useSelector(getSelectedCourse);

  return (
    <div className={classes.home}>
      {coursesLoading || !courses ? (
        <CircularProgress className={classes.loadingSpinner} />
      ) : (
        <>
          <Filters
            dispatch={dispatch}
            classes={classes}
            courses={courses}
            selectedCourse={selectedCourse}
          />
        </>
      )}
    </div>
  );
};

interface FiltersProps {
  dispatch: ReturnType<typeof useAppDispatch>;
  classes: ReturnType<typeof useStyles>;
  courses: ReturnType<typeof getCourses>;
  selectedCourse: ReturnType<typeof getSelectedCourse>;
}

const Filters: FC<FiltersProps> = ({
  dispatch,
  classes,
  courses,
  selectedCourse,
}) => {
  return (
    <div className={classes.filters}>
      <ThemedSelect
        className={classes.courseSelect}
        options={courses.map((course) => ({
          label: course.title,
          value: course.title,
        }))}
        value={
          selectedCourse
            ? {
                label: selectedCourse,
                value: selectedCourse,
              }
            : null
        }
        onChange={(option) =>
          dispatch(changeCourse(option ? option.value : null))
        }
        placeholder="Select a course..."
      />
    </div>
  );
};

export default Home;
