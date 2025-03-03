import { useEffect, useState } from "react";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";
import { createUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth, useNotification } from "../../hooks";
import { isValidEmail } from "../../utils/helper";
import { SignUpForm } from "../ui/SignupForm";
import { toast } from "sonner";

const validateUserInfo = ({ name, email, password }) => {
  // const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  // const isValidEmail = /[^\s@]+@[^\s@]+\.[^\s@]+/gi;
  const isValidName = /^[a-z A-Z]+$/;

  if (!name.trim()) return { ok: false, error: "Name is missing!" };
  if (!isValidName.test(name)) return { ok: false, error: "Name is invalid!" };

  if (!email.trim()) return { ok: false, error: "Email is missing!" };
  if (!isValidEmail(email)) return { ok: false, error: "Invalid email!" };

  if (!password.trim()) return { ok: false, error: "Password is missing!" };
  if (password.length < 8)
    return { ok: false, error: "Password must be 8 characters!" };

  return { ok: true };
};

function Signup() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;

  const handleChange = ({ target }) => {
    // console.log(target);
    const { value, name } = target;
    setUserInfo({ ...userInfo, [name]: value });
    // console.log(target.value, target.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);
    if (!ok) return toast.error(error);

    const response = await createUser(userInfo);
    // already defined 'error', so don't use desctructuring
    console.log(response);
    if (response.error) return toast.error(response.error);
    navigate("/auth/verification", {
      state: { user: response.user },
      replace: true,
    });
    // console.log(response.user);
  };

  const { name, email, password } = userInfo;

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn]);

  return (
    <FormContainer>
      <SignUpForm className="w-96" />
    </FormContainer>
  );
}

export default Signup;
