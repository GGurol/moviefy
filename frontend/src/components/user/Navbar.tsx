import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import Container from "../Container";
import AppSearchForm from "../form/AppSearchForm";
import LanguageButton from "../ui/LanguageButton";
import ThemeButton from "../ui/ThemeButton";
import { Button } from "../ui/button";

export default function Navbar() {
  const { authInfo, handleLogout } = useAuth();
  const { isLoggedIn } = authInfo;

  const navigate = useNavigate();

  const handleSearchSubmit = (query) => {
    navigate("/movie/search?title=" + query);
  };

  const { t } = useTranslation();

  return (
    <Container>
      <div className="flex items-center justify-between relative p-5">
        <div>
          <Link to="/">
            <img src="./logo.svg" alt="" className="sm:h-10 h-8" />
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <AppSearchForm
            placeholder={t("Search Movies...")}
            onSubmit={handleSearchSubmit}
          />
          <ThemeButton />
          <LanguageButton />

          {isLoggedIn ? (
            <Button onClick={handleLogout}>{t("Log out")}</Button>
          ) : (
            <NavLink to="/auth/signin">
              <Button variant="link">{t("Login")}</Button>
            </NavLink>
          )}
        </div>
      </div>
    </Container>
  );
}
