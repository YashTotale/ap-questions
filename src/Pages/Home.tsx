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
import {
  CircularProgress,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  loadingSpinner: {
    marginTop: theme.spacing(2),
  },
  home: {
    display: "flex",
    justifyContent: "center",
    width: "80%",
    margin: "auto",
    padding: theme.spacing(3),
  },
  filters: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: theme.spacing(2),
  },
  filtersHeading: {
    margin: theme.spacing(1),
  },
  courseSelect: {
    width: "70%",
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
    <Paper className={classes.filters} elevation={10}>
      <Typography variant="h5" className={classes.filtersHeading}>
        Filters
      </Typography>
      <Filter
        name="Course"
        action={
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
        }
      />
    </Paper>
  );
};

const useFilterStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  name: {
    marginRight: theme.spacing(1),
  },
}));

interface FilterProps {
  name: string;
  action: JSX.Element;
}

const Filter: FC<FilterProps> = ({ name, action }) => {
  const classes = useFilterStyles();

  return (
    <div className={classes.wrapper}>
      <Typography className={classes.name}>
        <strong>{name}</strong>:
      </Typography>
      {action}
    </div>
  );
};

export default Home;
