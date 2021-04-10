//React Imports
import React, { FC } from "react";
import { useHistory } from "react-router";
import Filters from "./Filters";
import Questions from "./Questions";

// Redux Imports
import { useSelector } from "react-redux";
import { getUser, togglePopup } from "../../Redux";
import { useAppDispatch } from "../../Store";

//Material UI Imports
import {
  Fab,
  makeStyles,
  Theme,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) => ({
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
  fab: {
    position: "absolute",
    bottom: theme.spacing(3),
    right: theme.spacing(4),

    [theme.breakpoints.down("xs")]: {
      bottom: theme.spacing(1),
      right: theme.spacing(1),
    },
  },
}));

const Home: FC = () => {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();

  const isSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const user = useSelector(getUser);

  return (
    <>
      <div className={classes.home}>
        <Filters />
        <Questions />
      </div>
      <Tooltip title="Create a question">
        <Fab
          className={classes.fab}
          color="primary"
          size={isSmall ? "medium" : "large"}
          onClick={() =>
            user.isEmpty
              ? dispatch(togglePopup({ open: true, type: "login" }))
              : history.push("/create")
          }
        >
          <Add />
        </Fab>
      </Tooltip>
    </>
  );
};

export default Home;
