import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuth } from "../../hooks";
import { isValidEmail } from "../../utils/helper";
import FormContainer from "../form/FormContainer";
import { LoginForm } from "../ui/LoginForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
// import { useTheme } from '../../hooks';

const validateUserInfo = ({ email, password }) => {
  // const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  // const isValidEmail = /[^\s@]+@[^\s@]+\.[^\s@]+/gi;

  if (!email.trim()) return { ok: false, error: "Email is missing!" };
  if (!isValidEmail(email)) return { ok: false, error: "Invalid email!" };

  if (!password.trim()) return { ok: false, error: "Password is missing!" };
  if (password.length < 8)
    return { ok: false, error: "Password must be 8 characters!" };

  return { ok: true };
};

export default function Signin() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const { handleLogin, authInfo } = useAuth();
  const { isPending } = authInfo;
  const { t } = useTranslation();

  // console.log(authInfo);

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };
  // const theme = useTheme();
  // console.log(theme);
  // theme.method();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);
    if (!ok) return toast.error(t(error as string));
    handleLogin(userInfo.email, userInfo.password);
  };

  // // already used in AuthProvider.jsx
  // useEffect(() => {
  //   if (isLoggedIn) navigate('/');
  // }, [isLoggedIn]);

  return (
    // <FormContainer>
    //   <Container>
    //     <form onSubmit={handleSubmit} className={commonModalClasses + ' w-72'}>
    //       <Title>Sign in</Title>
    //       <FormInput
    //         value={userInfo.email}
    //         onChange={handleChange}
    //         label='Email'
    //         placeholder='john@email.com'
    //         name='email'
    //       />
    //       <FormInput
    //         value={userInfo.password}
    //         onChange={handleChange}
    //         label='Password'
    //         placeholder='********'
    //         name='password'
    //         type='password'
    //       />
    //       <Submit value='Sign in' busy={isPending} />
    //       <div className='flex justify-between'>
    //         <CustomLink to='/auth/forget-password'>Forget password</CustomLink>
    //         <CustomLink to='/auth/signup'>Sign up</CustomLink>
    //       </div>
    //     </form>
    //   </Container>
    // </FormContainer>
    <FormContainer className="w-96 mx-auto">
      <Tabs defaultValue="user" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user">{t("User")}</TabsTrigger>
          <TabsTrigger value="admin">{t("Admin")}</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <LoginForm
            title="Login as User"
            defaultEmail="test1@email.com"
            defaultPass="123123123"
          />
        </TabsContent>
        <TabsContent value="admin">
          <LoginForm
            title="Login as Admin"
            defaultEmail="test@email.com"
            defaultPass="123123123"
          />
        </TabsContent>
      </Tabs>
    </FormContainer>
  );
}
