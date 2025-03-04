import { BsFillSunFill } from "react-icons/bs";
import Container from "../Container";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import AppSearchForm from "../form/AppSearchForm";
import ThemeButton from "../ui/ThemeButton";
import { Button } from "../ui/button";

export default function Navbar() {
  const { authInfo, handleLogout } = useAuth();
  const { isLoggedIn } = authInfo;

  const navigate = useNavigate();

  const handleSearchSubmit = (query) => {
    navigate("/movie/search?title=" + query);
  };

  return (
    <div className="flex items-center justify-between relative p-5">
      <div>
        <Link to="/">
          <img src="./logo.png" alt="" className="sm:h-10 h-8" />
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <AppSearchForm
          placeholder="Search"
          // inputClassName="border-dark-subtle text-white focus:border-white sm:w-auto w-40 sm:text-lg"
          onSubmit={handleSearchSubmit}
        />
        <ThemeButton />
        {isLoggedIn ? (
          <Button onClick={handleLogout}>Log out</Button>
        ) : (
          <NavLink to="/auth/signin">
            <Button variant="link">Login</Button>
          </NavLink>
        )}
      </div>
    </div>
  );
}
