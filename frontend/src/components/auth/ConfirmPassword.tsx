import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { resetPassword, verifyPasswordResetToken } from "../../api/auth";
import Container from "../Container";
import FormContainer from "../form/FormContainer";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function ConfirmPassword() {
  const [password, setPassword] = useState({
    one: "",
    two: "",
  });
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const id = searchParams.get("id");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    isValidToken();
  }, []);

  const isValidToken = async () => {
    const { error, valid } = await verifyPasswordResetToken(token, id);
    setIsVerifying(false);
    if (error) {
      navigate("/auth/reset-password", { replace: true });

      return toast.error(t(error));
    }

    if (!valid) {
      setIsValid(false);
      return navigate("/auth/reset-password", { replace: true });
    }

    setIsValid(true);
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setPassword({ ...password, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.one.trim()) return toast.error(t("Password is missing"));
    if (password.one.trim().length < 8)
      return toast.error(t("Password must be at least 8 characters"));
    if (password.one !== password.two)
      return toast.error(t("Password does not match"));

    const { error, message } = await resetPassword({
      newPassword: password.one,
      userId: id,
      token,
    });

    if (error) return toast.error(t(error));

    toast.success(t(message));
    navigate("/auth/signin", { replace: true });

    // console.log(password);
  };

  if (isVerifying)
    return (
      <FormContainer>
        <Container>
          <div className="flex gap-1 items-center">
            <h1 className="text-3xl font-semibold">
              {t("Please wait we are verifying your token!")}
            </h1>
            <Loader className="animate-spin" size={30} />
          </div>
        </Container>
      </FormContainer>
    );

  if (!isValid)
    return (
      <FormContainer>
        <Container>
          <h1 className="text-3xl font-semibold ">
            {t("Sorry the token is invalid!")}
          </h1>
        </Container>
      </FormContainer>
    );

  return (
    <FormContainer>
      <form onSubmit={handleSubmit} className="w-80">
        <Card>
          <CardHeader className="font-bold">
            {t("Enter New Password")}
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Label htmlFor="one">{t("New Password")}</Label>
              <Input
                id="one"
                name="one"
                value={password.one}
                onChange={handleChange}
                placeholder="************"
                type="password"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="two">{t("Confirm Password")}</Label>
              <Input
                id="two"
                name="two"
                value={password.two}
                onChange={handleChange}
                placeholder="************"
                type="password"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              {t("Submit")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormContainer>
  );
}

export default ConfirmPassword;
