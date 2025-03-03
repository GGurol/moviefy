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
import { BsGoogle } from "react-icons/bs";
import { Form, FormField } from "./form";
import CustomLink from "../CustomLink";
import { isValidEmail } from "@/utils/helper";
import { useState } from "react";
import { useAuth, useNotification } from "@/hooks";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const validateUserInfo = ({ email, password }) => {
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

export function LoginForm({
  className,
  title,
  defaultEmail,
  defaultPass,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [userInfo, setUserInfo] = useState({
    email: defaultEmail,
    password: defaultPass,
  });

  const { handleLogin, authInfo } = useAuth();
  const { isPending } = authInfo;

  // console.log(authInfo);

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);
    if (!ok) return toast.error(error);
    handleLogin(userInfo.email, userInfo.password);
  };
  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full">
                  <BsGoogle />
                  Login with Google
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={userInfo.email || defaultEmail}
                    onChange={handleChange}
                    name="email"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/auth/forget-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="****************"
                    value={userInfo.password || defaultPass}
                    onChange={handleChange}
                    name="password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  Login
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <CustomLink to="/auth/signup">Sign up</CustomLink>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
