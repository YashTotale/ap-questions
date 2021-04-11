// React Imports
import React, { FC } from "react";
import { NamedProps } from "react-select";
import ThemedSelect from "./ThemedSelect";

// Redux Imports
import { useSelector } from "react-redux";
import { getCourses } from "../../Redux";

interface CourseSelectorProps {
  className?: string;
  selectedCourse: string | null;
  onChange: NamedProps["onChange"];
}

const CourseSelector: FC<CourseSelectorProps> = ({
  className,
  selectedCourse,
  onChange,
}) => {
  const courses = useSelector(getCourses);

  return (
    <ThemedSelect
      className={className}
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
      onChange={onChange}
      placeholder="Select a course..."
    />
  );
};

export default CourseSelector;
