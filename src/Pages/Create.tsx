// React Imports
import React, { FC } from "react";
import { Redirect } from "react-router";

// Redux Imports
import { useSelector } from "react-redux";
import { getUser, togglePopup } from "../Redux";
import { useAppDispatch } from "../Store";

const Create: FC = () => {
  const dispatch = useAppDispatch();
  const user = useSelector(getUser);

  if (user.isEmpty) {
    dispatch(togglePopup({ open: true, type: "login" }));
    return <Redirect to="/" />;
  }

  return null;
};

export default Create;
