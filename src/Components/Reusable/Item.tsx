// React Imports
import React, { FC } from "react";

// Material UI Imports
import { makeStyles, Typography } from "@material-ui/core";

const useItemStyles = makeStyles((theme) => ({
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

interface ItemProps {
  name: string;
  action: JSX.Element;
}

const Item: FC<ItemProps> = ({ name, action }) => {
  const classes = useItemStyles();

  return (
    <div className={classes.wrapper}>
      <Typography className={classes.name}>
        <strong>{name}</strong>:
      </Typography>
      {action}
    </div>
  );
};

export default Item;
