import React, { ReactNode } from "react";
import {
  useSnackbar,
  OptionsObject,
  SnackbarKey,
  ProviderContext,
} from "notistack";
import { IconButton } from "@material-ui/core";
import { Clear } from "@material-ui/icons";

const useClosableSnackbar = (): ProviderContext => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const closeButton = (key: SnackbarKey) => (
    <IconButton onClick={() => closeSnackbar(key)} size="small">
      <Clear fontSize="small" />
    </IconButton>
  );

  const enqueueClosableSnackbar = (
    message: ReactNode,
    options?: OptionsObject
  ) => {
    const newOptions: OptionsObject = {
      ...options,
      action: (key: SnackbarKey) => {
        if (options?.action) {
          let action = options.action;
          if (typeof options.action === "function")
            action = options.action(key);

          return (
            <>
              {action}
              {closeButton(key)}
            </>
          );
        } else return closeButton(key);
      },
    };
    return enqueueSnackbar(message, newOptions);
  };

  return { enqueueSnackbar: enqueueClosableSnackbar, closeSnackbar };
};

export default useClosableSnackbar;
