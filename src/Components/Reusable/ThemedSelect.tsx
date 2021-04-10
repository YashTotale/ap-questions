// React Imports
import React, { FC } from "react";
import Select, { Props } from "react-select";

// Material UI Imports
import { useTheme } from "@material-ui/core";

const ThemedSelect: FC<Props> = (props) => {
  const theme = useTheme();

  return (
    <Select
      {...props}
      theme={(defaultTheme) => ({
        ...defaultTheme,
        colors:
          theme.palette.type === "dark"
            ? {
                danger: "red",
                dangerLight: theme.palette.grey[200],
                neutral0: theme.palette.background.paper,
                neutral5: "orange",
                neutral20: theme.palette.grey["A200"],
                neutral30: theme.palette.text.primary,
                neutral40: theme.palette.grey["A200"],
                neutral50: theme.palette.grey["A200"],
                neutral60: theme.palette.grey["A200"],
                neutral70: theme.palette.grey["A200"],
                neutral80: theme.palette.text.primary,
                neutral90: "pink",
                primary: theme.palette.text.primary,
                primary25: theme.palette.background.paper,
                primary50: theme.palette.background.paper,
                primary75: theme.palette.background.paper,
              }
            : defaultTheme.colors,
      })}
    />
  );
};

export default ThemedSelect;
