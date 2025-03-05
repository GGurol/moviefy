import AuthProvider from "./AuthProvider";
import MoviesProvider from "./MoviesProvider";
import SearchProvider from "./SearchProvider";
// import ThemeProvider from './ThemeProvider';

function ContextProviders({ children }) {
  return (
    // <NotificationProvider>
    <SearchProvider>
      <MoviesProvider>
        <AuthProvider>{children}</AuthProvider>
      </MoviesProvider>
    </SearchProvider>
    // </NotificationProvider>
  );
}

export default ContextProviders;
