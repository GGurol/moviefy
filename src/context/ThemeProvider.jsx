import { createContext, useEffect } from 'react';

const ThemeContext = createContext();

const defaultTheme = 'light';
const darkTheme = 'dark';

function ThemeProvider({ children }) {
  const toggleTheme = () => {
    const oldTheme = getTheme();
    const newTheme = oldTheme === defaultTheme ? darkTheme : defaultTheme;

    updateTheme(newTheme, oldTheme);
    // document.documentElement.classList.remove(oldTheme);
    // document.documentElement.classList.add(newTheme);
    // localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const theme = getTheme();
    // if (!theme) document.documentElement.classList.add(defaultTheme);
    // else document.documentElement.classList.add(theme);
    if (!theme) updateTheme(defaultTheme);
    else updateTheme(theme);
  }, []);
  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

const getTheme = () => localStorage.getItem('theme');

const updateTheme = (theme, themeToRemove) => {
  if (themeToRemove) document.documentElement.classList.remove(themeToRemove);
  document.documentElement.classList.add(theme);
  localStorage.setItem('theme', theme);
};

export { ThemeContext };
export default ThemeProvider;
