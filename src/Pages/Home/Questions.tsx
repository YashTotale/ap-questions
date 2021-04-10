//React Imports
import React, { FC } from "react";

// Redux Imports
import { useSelector } from "react-redux";
import { getCourses, getSelectedCourse } from "../../Redux";

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

  if (!questions)
    return (
      <Typography align="center" color="error">
        <strong>No questions for &quot;{course.title}&quot; found</strong>
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
    padding: theme.spacing(3),
    width: "80%",
  },
  label: {
    fontSize: theme.typography.h5.fontSize,
    marginBottom: theme.spacing(1),

    [theme.breakpoints.down("xs")]: {
      fontSize: theme.typography.h6.fontSize,
    },
  },
  button: {
    margin: theme.spacing(1, 1, 0, 0),
  },
}));

const Question: FC<QuestionProps> = ({
  title,
  choices,
  helperText: initialHelperText,
}) => {
  const classes = useQuestionStyles();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("xs"));

  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState(initialHelperText);

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
      setHelperText(choice.helperText);
      setError(false);
    } else {
      setHelperText(choice.helperText);
      setError(true);
    }
  };

  return (
    <Paper elevation={5} className={classes.question}>
      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" error={error}>
          <FormLabel component="legend" className={classes.label}>
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
        </FormControl>
      </form>
    </Paper>
  );
};

export default Questions;
