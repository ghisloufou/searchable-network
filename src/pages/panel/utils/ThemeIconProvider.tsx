import React, { useContext } from "react";
import { IconContext } from "react-icons";
import { RequestContext } from "../newCode/Panel";

type ThemeIconProviderProps = {
  children: React.ReactNode;
};

export const ThemeIconProvider: React.FC<ThemeIconProviderProps> = ({
  children,
}) => {
  const { isDarkModeEnabled } = useContext(RequestContext);
  return (
    <IconContext.Provider
      value={{
        color: isDarkModeEnabled ? "white" : "black",
      }}
    >
      {children}
    </IconContext.Provider>
  );
};
