import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuth } from "../../hooks";
import { isValidEmail } from "../../utils/helper";
import FormContainer from "../form/FormContainer";
import CustomLink from "../CustomLink";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";

const validateUserInfo = ({ email, password }) => {
  if (!email.trim()) return { ok: false, error: "Email is missing!" };
  if (!isValidEmail(email)) return { ok: false, error: "Invalid email!" };
  if (!password.trim()) return { ok: false, error: "Password is missing!" };
  if (password.length < 8) {
    return { ok: false, error: "Password must be 8 characters!" };
  }
  return { ok: true };
};

export default function Signin() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const { handleLogin, authInfo } = useAuth();
  const { isPending, isLoggedIn } = authInfo;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);
    if (!ok) return toast.error(t(error as string));
    handleLogin(userInfo.email, userInfo.password);
  };

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  return (
    <FormContainer className="w-96 mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t("Login")}</CardTitle>
          <CardDescription>
            {t("Enter your email below to login to your account")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("Email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                    value={userInfo.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">{t("Password")}</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                    placeholder="****************"
                    value={userInfo.password}
                    onChange={handleChange}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? t("Logging in...") : t("Login")}
                </Button>
                <Link
                  to="/auth/forget-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  {t("Forgot your password?")}
                </Link>
              </div>
              <div className="text-center text-sm">
                {t("Don't have an account? ")}
                <CustomLink to="/auth/signup">
                  {t("Click here to sign up")}
                </CustomLink>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormContainer>
  );
}
