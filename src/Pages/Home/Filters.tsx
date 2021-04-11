//React Imports
import React, { FC } from "react";
import { splitCamelCase } from "../../Utils/funcs";
import CourseSelector from "../../Components/Reusable/CourseSelector";
import Item from "../../Components/Reusable/Item";

// Redux Imports
import { useSelector } from "react-redux";
import { changeCourse, getSelectedCourse, getOrderBy } from "../../Redux";
import { changeOrderBy, HomeState, orders } from "../../Redux/home.slice";
import { useAppDispatch } from "../../Store";

//Material UI Imports
import { Paper, makeStyles, Theme, Typography } from "@material-ui/core";
import ThemedSelect from "../../Components/Reusable/ThemedSelect";

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
  item: {
    margin: theme.spacing(1, 0),
  },
  select: {
    width: "70%",
  },
}));

const Filters: FC = () => {
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const selectedCourse = useSelector(getSelectedCourse);
  const orderBy = useSelector(getOrderBy);

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
            className={classes.select}
          />
        }
        className={classes.item}
      />
      <Item
        name="Order By"
        action={
          <ThemedSelect
            options={orders.map((order) => ({
              label: splitCamelCase(order),
              value: order,
            }))}
            value={{
              label: splitCamelCase(orderBy),
              value: orderBy,
            }}
            className={classes.select}
            onChange={(option) =>
              dispatch(
                changeOrderBy(
                  option ? (option.value as HomeState["orderBy"]) : "mostRecent"
                )
              )
            }
          />
        }
        className={classes.item}
      />
    </Paper>
  );
};

export default Filters;
