import { cn } from "@/lib/utils";
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
import CustomLink from "../CustomLink";
import { useEffect, useState } from "react";
import { createUser } from "@/api/auth";
import { useAuth } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "@/utils/helper";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const validateUserInfo = ({ name, email, password }) => {
  const isValidName = /^[a-z A-Z]+$/;

  if (!name.trim()) {
    return { ok: false, error: "Name is missing!" };
  }
  if (!isValidName.test(name)) {
    return { ok: false, error: "Name is invalid!" };
  }
  if (!email.trim()) {
    return { ok: false, error: "Email is missing!" };
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: "Invalid email!" };
  }
  if (!password.trim()) {
    return { ok: false, error: "Password is missing!" };
  }
  if (password.length < 8) {
    return { ok: false, error: "Password must be 8 characters!" };
  }
  return { ok: true };
};

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;
  const { t } = useTranslation();

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);
    if (!ok) return toast.error(t(error as string));

    const response = await createUser(userInfo);
    if (response.error) return toast.error(t(response.error));
    navigate("/auth/verification", {
      state: { user: response.user },
      replace: true,
    });
  };

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t("Create an Account")}</CardTitle>
          <CardDescription>
            {t("Enter your details below to create your account")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {/* Google Button and Separator Removed */}
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t("Username")}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t("John Doe")}
                    required
                    name="name"
                    onChange={handleChange}
                    value={userInfo.name}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("Email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    onChange={handleChange}
                    name="email"
                    value={userInfo.email}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t("Password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="****************"
                    name="password"
                    onChange={handleChange}
                    value={userInfo.password}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {t("Sign up")}
                </Button>
              </div>
              <div className="text-center text-sm">
                {t("Already have an account? ")}
                <CustomLink to="/auth/signin">{t("Click here to login")}</CustomLink>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}