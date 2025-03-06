import { BsFillSunFill } from "react-icons/bs";
import Container from "../Container";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import AppSearchForm from "../form/AppSearchForm";
import ThemeButton from "../ui/ThemeButton";
import { Button } from "../ui/button";
import i18n from "@/utils/i18n";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { authInfo, handleLogout } = useAuth();
  const { isLoggedIn } = authInfo;

  const navigate = useNavigate();

  const handleSearchSubmit = (query) => {
    navigate("/movie/search?title=" + query);
  };

  const lngs = [
    { code: "en", nativeName: "English" },
    { code: "zh", nativeName: "中文" },
  ];

  const { t } = useTranslation();

  return (
    <Container>
      <div className="flex items-center justify-between relative p-5">
        <div>
          <Link to="/">
            <img src="./logo.png" alt="" className="sm:h-10 h-8" />
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <AppSearchForm
            placeholder={t("Search movies...")}
            // inputClassName="border-dark-subtle text-white focus:border-white sm:w-auto w-40 sm:text-lg"
            onSubmit={handleSearchSubmit}
          />
          <ThemeButton />
          {lngs.map((lng) => {
            return (
              <button
                className="m-4 p-2 bg-blue-600 rounded"
                key={lng.code}
                type="submit"
                onClick={() => i18n.changeLanguage(lng.code)}
              >
                {lng.nativeName}
              </button>
            );
          })}
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
