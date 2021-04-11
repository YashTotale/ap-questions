//React Imports
import React, { FC } from "react";
import { Link } from "react-router-dom";

// Redux Imports
import { useSelector } from "react-redux";
import { getCourses, getSelectedCourse, getUsers } from "../../Redux";

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
} from "@material-ui/core";
import { Question as QuestionProps } from "../../Store";

const Questions: FC = () => {
  const courses = useSelector(getCourses);
  const selectedCourse = useSelector(getSelectedCourse);

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

  const questions = course.questions;

  if (!questions.length)
    return (
      <Typography align="center" color="error">
        <strong>No questions found for &quot;{course.title}&quot;</strong>.{" "}
        <Link to={{ pathname: "/create" }}>
          <MuiLink>Create your own!</MuiLink>
        </Link>
      </Typography>
    );

  return (
    <>
      {questions.map((q) => (
        <Question key={q.title} {...q} />
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
  },
  formControl: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
  button: {
    margin: theme.spacing(1, 0, 2),
  },
}));

const Question: FC<QuestionProps> = ({
  title,
  choices,
  helperText: initialHelperText,
  author,
  timestamp,
}) => {
  const classes = useQuestionStyles();
  const theme = useTheme();
  const users = useSelector(getUsers);
  const isSmall = useMediaQuery(theme.breakpoints.down("xs"));

  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState(initialHelperText);

  const authorName = users?.[author]?.name;
  const date = new Date(timestamp);

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
          <FormLabel component="h5" className={classes.label}>
            {title}
          </FormLabel>
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
