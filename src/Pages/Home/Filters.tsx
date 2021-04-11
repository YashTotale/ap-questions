//React Imports
import React, { FC } from "react";
import CourseSelector from "../../Components/Reusable/CourseSelector";
import Item from "../../Components/Reusable/Item";

// Redux Imports
import { useSelector } from "react-redux";
import { changeCourse, getSelectedCourse } from "../../Redux";
import { useAppDispatch } from "../../Store";

//Material UI Imports
import { Paper, makeStyles, Theme, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  filters: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: theme.spacing(2),
    margin: theme.spacing(0, 0, 3),
  },
  filtersHeading: {
    margin: theme.spacing(1),
  },
  courseSelect: {
    width: "70%",
  },
}));

const Filters: FC = () => {
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const selectedCourse = useSelector(getSelectedCourse);

  return (
    <Paper className={classes.filters} elevation={10}>
      <Typography variant="h5" className={classes.filtersHeading}>
        Filters
      </Typography>
      <Item
        name="Course"
        action={
          <CourseSelector
            onChange={(option) =>
              dispatch(changeCourse(option ? option.value : null))
            }
            selectedCourse={selectedCourse}
            className={classes.courseSelect}
          />
        }
      />
    </Paper>
  );
};

export default Filters;
