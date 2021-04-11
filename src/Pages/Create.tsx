// React Imports
import React, { FC, useState } from "react";
import { Redirect, useHistory } from "react-router";
import { useClosableSnackbar } from "../Hooks";
import CourseSelector from "../Components/Reusable/CourseSelector";

// Redux Imports
import { useSelector } from "react-redux";
import { getCourses, getUser, togglePopup, changeCourse } from "../Redux";
import { useAppDispatch } from "../Store";

// Firebase Imports
import { useFirestore } from "react-redux-firebase";

// Material UI Imports
import {
  FormControl,
  FormHelperText,
  makeStyles,
  Paper,
  Typography,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  create: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    margin: theme.spacing(3),
    padding: theme.spacing(2),
  },
  createHeading: {
    margin: theme.spacing(1),
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  formControl: {
    width: "70%",
    [theme.breakpoints.down("xs")]: {
      width: "90%",
    },
  },
  courseSelect: {
    width: "100%",
    margin: theme.spacing(1, 0),
  },
  textField: {
    marginTop: theme.spacing(1),
    width: "100%",
  },
  choices: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "50%",
  },
  choice: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: theme.spacing(1, 0),
  },
  choiceTextWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  choiceText: {
    width: "300px",
    [theme.breakpoints.down("xs")]: {
      width: "120px",
    },
  },
  addChoice: {
    marginTop: theme.spacing(2),
    maxWidth: "140px",
  },
  helperText: {
    fontSize: theme.typography.subtitle1.fontSize,
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const Create: FC = () => {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const firestore = useFirestore();
  const { enqueueSnackbar } = useClosableSnackbar();
  const history = useHistory();

  const user = useSelector(getUser);
  const courses = useSelector(getCourses);

  const isSmall = useMediaQuery(theme.breakpoints.down("xs"));

  const [title, setTitle] = useState("");
  const [questionHelpText, setQuestionHelpText] = useState("");
  const [course, setCourse] = useState<string | null>(null);
  const [correctChoice, setCorrectChoice] = useState<string | null>(null);
  const [choices, setChoices] = useState<string[]>([""]);

  const [helperText, setHelperText] = useState("");
  const [error, setError] = useState(false);

  if (user.isEmpty) {
    dispatch(togglePopup({ open: true, type: "login" }));
    return <Redirect to="/" />;
  }

  const onChange = <T extends unknown>(func: (e: T) => void) => {
    return (e: T) => {
      setError(false);
      setHelperText("");
      func(e);
    };
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let newHelperText = "";

    if (!title.length) {
      newHelperText += "Please add a title\n";
    }

    if (course === null) {
      newHelperText += "Please select a course\n";
    }

    if (correctChoice === null) {
      newHelperText += "Please select a correct choice\n";
    }

    if (choices.length < 2) {
      newHelperText += "Each question must have at least 2 choices\n";
    }

    choices.forEach((choice, i) => {
      if (!choice.length) {
        newHelperText += `Please add a label for choice ${i + 1}\n`;
      }
    });

    if (newHelperText.length) {
      setError(true);
      setHelperText(newHelperText);
    } else {
      const courseObj = courses.find((c) => c.title === course);

      if (!courseObj) {
        setError(true);
        setHelperText(`Unable to find course "${course}"`);
      } else {
        firestore
          .update(`courses/${courseObj.id}`, {
            questions: [
              ...courseObj.questions,
              {
                title,
                author: user.uid,
                helperText: questionHelpText,
                timestamp: Date.now(),
                choices: choices.map((choice, i) => ({
                  title: choice,
                  isCorrect: i.toString() === correctChoice,
                })),
              },
            ],
          })
          .then(() => {
            enqueueSnackbar("Successfully created question!", {
              variant: "success",
            });
            dispatch(changeCourse(courseObj.title));
            history.push("/");
          })
          .catch(() => {
            enqueueSnackbar("An error occurred. Please try again.", {
              variant: "error",
            });
          });
      }
    }
  };

  return (
    <>
      <Paper elevation={10} className={classes.create}>
        <Typography variant="h5" className={classes.createHeading}>
          Create a question
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
          <FormControl
            component="fieldset"
            error={error}
            fullWidth
            className={classes.formControl}
          >
            <TextField
              variant="outlined"
              size="small"
              label="Title"
              helperText="Ex. What is electroplating?"
              className={classes.textField}
              value={title}
              onChange={onChange((e) => setTitle(e.target.value))}
            />
            <TextField
              variant="outlined"
              size="small"
              label="(Optional) Helper Text"
              helperText="Ex. Think of Galvanic cells!"
              className={classes.textField}
              value={questionHelpText}
              onChange={(e) => setQuestionHelpText(e.target.value)}
            />
            <CourseSelector
              selectedCourse={course}
              onChange={(option) => setCourse(option ? option.value : null)}
              className={classes.courseSelect}
            />
            <div className={classes.choices}>
              <Typography variant="h6">Choices</Typography>
              <RadioGroup
                name="choices"
                value={correctChoice}
                onChange={onChange((e) => setCorrectChoice(e.target.value))}
              >
                {choices.map((choice, i) => (
                  <FormControlLabel
                    key={i}
                    value={i.toString()}
                    label={
                      <div className={classes.choiceTextWrapper}>
                        <TextField
                          variant="standard"
                          value={choice}
                          onChange={onChange((e) => {
                            const newChoices = [...choices];
                            newChoices[i] = e.target.value;
                            setChoices(newChoices);
                          })}
                          label={`Choice ${i + 1}`}
                          size={isSmall ? "small" : "medium"}
                          className={classes.choiceText}
                        />
                        <IconButton
                          size={isSmall ? "small" : "medium"}
                          onClick={() => {
                            const newChoices = [...choices];
                            newChoices.splice(i, 1);
                            setChoices(newChoices);
                          }}
                        >
                          <Close fontSize={isSmall ? "small" : "default"} />
                        </IconButton>
                      </div>
                    }
                    control={<Radio size={isSmall ? "small" : "medium"} />}
                    className={classes.choice}
                  />
                ))}
              </RadioGroup>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                onClick={() => setChoices([...choices, ""])}
                className={classes.addChoice}
              >
                Add Choice
              </Button>
            </div>
            {helperText.split("\n").map((text, i) => (
              <FormHelperText key={i} className={classes.helperText}>
                {text}
              </FormHelperText>
            ))}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Create Question
            </Button>
          </FormControl>
        </form>
      </Paper>
    </>
  );
};

export default Create;
