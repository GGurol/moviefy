import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import { useTranslation } from "react-i18next";

function NotVerified() {
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;
  const isVerified = authInfo.profile?.isVerified;
  // console.log(authInfo);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const navigateToVerification = () => {
    navigate("/auth/verification", { state: { user: authInfo.profile } });
  };

  return (
    <div>
      {isLoggedIn && !isVerified ? (
        <p className="text-sm text-muted-foreground  text-center p-1 bg-muted rounded-md mb-2">
          {t(`It looks like you haven't verified your email address. `)}
          <button
            onClick={navigateToVerification}
            className="text-red-500 font-semibold hover:underline text-sm"
          >
            {t("Click here to verify.")}
          </button>
        </p>
      ) : null}
    </div>
  );
}

export default NotVerified;
