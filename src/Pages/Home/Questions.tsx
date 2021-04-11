//React Imports
import React, { FC } from "react";
import { Link } from "react-router-dom";

// Redux Imports
import { useSelector } from "react-redux";
import {
  getCourses,
  getOrderBy,
  getSelectedCourse,
  getUser,
  getUsers,
  togglePopup,
} from "../../Redux";
import {
  Course,
  Question as QuestionSchema,
  useAppDispatch,
} from "../../Store";

// Firebase Imports
import { TypeWithId, useFirestore } from "react-redux-firebase";

//Material UI Imports
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  makeStyles,
  Paper,
  Radio,
  RadioGroup,
  Typography,
  useMediaQuery,
  useTheme,
  Link as MuiLink,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";

const Questions: FC = () => {
  const courses = useSelector(getCourses);
  const selectedCourse = useSelector(getSelectedCourse);
  const orderBy = useSelector(getOrderBy);

  if (!selectedCourse)
    return (
      <Typography align="center" color="error">
        <strong>Please select a course above</strong>
      </Typography>
    );

  const course = courses.find((course) => course.title === selectedCourse);

  if (!course)
    return (
      <Typography align="center" color="error">
        <strong>
          Could not find the selected course &quot;{selectedCourse}&quot;
        </strong>
      </Typography>
    );

  if (!course.questions.length)
    return (
      <Typography align="center" color="error">
        <strong>No questions found for &quot;{course.title}&quot;</strong>.{" "}
        <Link to={{ pathname: "/create" }}>
          <MuiLink>Create your own!</MuiLink>
        </Link>
      </Typography>
    );

  let questions = [...course.questions];

  switch (orderBy) {
    case "mostRecent": {
      questions = questions.sort((a, b) => b.timestamp - a.timestamp);
      break;
    }
    case "oldest": {
      questions = questions.sort((a, b) => a.timestamp - b.timestamp);
      break;
    }
    case "mostLikes": {
      questions = questions.sort((a, b) => b.likes.length - a.likes.length);
      break;
    }
    case "leastLikes": {
      questions = questions.sort((a, b) => a.likes.length - b.likes.length);
      break;
    }
  }

  return (
    <>
      {questions.map((q, i) => (
        <Question
          key={i}
          {...q}
          questions={questions}
          course={course}
          index={i}
        />
      ))}
    </>
  );
};

const useQuestionStyles = makeStyles((theme) => ({
  question: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(3, 3, 1),
    width: "80%",
    margin: theme.spacing(2, 0),
  },
  formControl: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  labelWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "relative",
    padding: theme.spacing(0, 1),
  },
  label: {
    fontSize: theme.typography.h5.fontSize,
    margin: theme.spacing(1, 0),
    color: `${theme.palette.text.primary} !important`,
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      fontSize: theme.typography.h6.fontSize,
    },
  },
  likeButton: {
    position: "absolute",
    right: "0%",
  },
  button: {
    margin: theme.spacing(1, 0, 2),
  },
}));

interface QuestionProps extends QuestionSchema {
  course: TypeWithId<Course>;
  questions: Course["questions"];
  index: number;
}

const Question: FC<QuestionProps> = ({
  title,
  choices,
  helperText: initialHelperText,
  author,
  timestamp,
  likes = [],
  course,
  questions,
  index,
}) => {
  const classes = useQuestionStyles();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const firestore = useFirestore();

  const user = useSelector(getUser);
  const users = useSelector(getUsers);
  const isSmall = useMediaQuery(theme.breakpoints.down("xs"));

  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState(initialHelperText);

  const authorName = users?.[author]?.name;
  const date = new Date(timestamp);
  const liked = likes.includes(user.uid);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setError(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const choice = choices.find((choice) => choice.title === value);

    if (!choice) {
      setHelperText("Please select an option.");
      setError(true);
    } else if (choice.isCorrect) {
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <Paper elevation={5} className={classes.question}>
      <form onSubmit={handleSubmit}>
        <FormControl
          component="fieldset"
          error={error}
          className={classes.formControl}
        >
          <div className={classes.labelWrapper}>
            <FormLabel component="h5" className={classes.label}>
              {title}
            </FormLabel>
            <Tooltip title={likes.length}>
              <IconButton
                className={classes.likeButton}
                size={isSmall ? "small" : "medium"}
                onClick={() => {
                  if (user.isEmpty) {
                    dispatch(togglePopup({ open: true, type: "login" }));
                    return;
                  }

                  if (liked) {
                    const newLikes = [...likes];
                    newLikes.splice(newLikes.indexOf(user.uid), 1);

                    const newQuestions = [...questions];
                    newQuestions[index] = {
                      ...newQuestions[index],
                      likes: newLikes,
                    };

                    firestore.update(`courses/${course.id}`, {
                      questions: newQuestions,
                    });
                  } else {
                    const newLikes = [...likes];
                    newLikes.push(user.uid);

                    const newQuestions = [...questions];
                    newQuestions[index] = {
                      ...newQuestions[index],
                      likes: newLikes,
                    };

                    firestore.update(`courses/${course.id}`, {
                      questions: newQuestions,
                    });
                  }
                }}
              >
                {liked ? (
                  <Favorite fontSize={isSmall ? "small" : "large"} />
                ) : (
                  <FavoriteBorder fontSize={isSmall ? "small" : "large"} />
                )}
              </IconButton>
            </Tooltip>
          </div>
          <RadioGroup name="choices" value={value} onChange={handleRadioChange}>
            {choices.map((choice, i) => (
              <FormControlLabel
                key={i}
                value={choice.title}
                label={choice.title}
                control={<Radio />}
              />
            ))}
          </RadioGroup>
          <FormHelperText>{helperText}</FormHelperText>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            className={classes.button}
            size={isSmall ? "small" : "medium"}
          >
            Check Answer
          </Button>
          <Typography variant="body2">
            {authorName && `Question created by ${authorName}. `}Created on
            {` ${
              date.getUTCMonth() + 1
            }/${date.getDate()}/${date.getUTCFullYear()}`}
          </Typography>
        </FormControl>
      </form>
    </Paper>
  );
};

export default Questions;
