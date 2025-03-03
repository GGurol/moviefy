import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";

function NotVerified() {
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;
  const isVerified = authInfo.profile?.isVerified;
  // console.log(authInfo);

  const navigate = useNavigate();
  const navigateToVerification = () => {
    navigate("/auth/verification", { state: { user: authInfo.profile } });
  };

  return (
    <div>
      {isLoggedIn && !isVerified ? (
        <p className="text-sm text-center p-2 bg-muted rounded-md mb-2">
          {`It looks like you haven't verified your account`},{" "}
          <button
            onClick={navigateToVerification}
            className="text-blue-500 font-semibold hover:underline text-sm"
          >
            click here to verify your account.
          </button>
        </p>
      ) : null}
    </div>
  );
}

export default NotVerified;
