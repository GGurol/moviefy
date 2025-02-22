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

  const { updateNotification } = useNotification();

  const handleChange = ({ target }) => {
    // console.log(target);
    const { value, name } = target;
    setUserInfo({ ...userInfo, [name]: value });
    // console.log(target.value, target.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);
    if (!ok) return updateNotification("error", error);

    const response = await createUser(userInfo);
    // already defined 'error', so don't use desctructuring
    console.log(response);
    if (response.error) return updateNotification("error", response.error);
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
    // <FormContainer>
    //   <Container>
    //     <form onSubmit={handleSubmit} className={commonModalClasses + ' w-72'}>
    //       <Title>Sign up</Title>
    //       <FormInput
    //         value={name}
    //         onChange={handleChange}
    //         label='Name'
    //         placeholder='John Doe'
    //         name='name'
    //       />
    //       <FormInput
    //         value={email}
    //         onChange={handleChange}
    //         label='Email'
    //         placeholder='john@email.com'
    //         name='email'
    //       />
    //       <FormInput
    //         value={password}
    //         onChange={handleChange}
    //         label='Password'
    //         placeholder='********'
    //         name='password'
    //         type='password'
    //       />
    //       <Submit value='Sign up' />
    //       <div className='flex justify-between'>
    //         <CustomLink to='/auth/forget-password'>Forget password</CustomLink>
    //         <CustomLink to='/auth/signin'>Sign in</CustomLink>
    //       </div>
    //     </form>
    //   </Container>
    // </FormContainer>

    <FormContainer>
      <SignUpForm />
    </FormContainer>
  );
}

export default Signup;
