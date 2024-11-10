import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toogletheme } from "../redux/reducers/theme/themeSlice";

const ThemeSwitch = () => {
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    dispatch(toogletheme(newTheme));
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div
      className={`switch ${isDarkMode ? "light" : "dark"}`}
      onClick={toggleTheme}
    >
      <div className={`ball ${isDarkMode ? "dark" : "light"}`}></div>
    </div>
  );
};

export default ThemeSwitch;
