import Container from '../Container';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import Title from '../form/Title';
import CustomLink from '../CustomLink';
import { commonModalClasses } from '../../utils/theme';
import FormContainer from '../form/FormContainer';
import { useEffect, useState } from 'react';
import { useAuth, useNotification } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { isValidEmail } from '../../utils/helper';
// import { useTheme } from '../../hooks';

const validateUserInfo = ({ email, password }) => {
  // const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  // const isValidEmail = /[^\s@]+@[^\s@]+\.[^\s@]+/gi;

  if (!email.trim()) return { ok: false, error: 'Email is missing!' };
  if (!isValidEmail(email)) return { ok: false, error: 'Invalid email!' };

  if (!password.trim()) return { ok: false, error: 'Password is missing!' };
  if (password.length < 8)
    return { ok: false, error: 'Password must be 8 characters!' };

  return { ok: true };
};

function Signin() {
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { updateNotification } = useNotification();
  const { handleLogin, authInfo } = useAuth();
  const { isPending, isLoggedIn } = authInfo;

  console.log(authInfo);

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
    if (!ok) return updateNotification('error', error);
    handleLogin(userInfo.email, userInfo.password);
  };

  useEffect(() => {
    if (isLoggedIn) navigate('/');
  }, [isLoggedIn]);

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + ' w-72'}>
          <Title>Sign in</Title>
          <FormInput
            value={userInfo.email}
            onChange={handleChange}
            label='Email'
            placeholder='john@email.com'
            name='email'
          />
          <FormInput
            value={userInfo.password}
            onChange={handleChange}
            label='Password'
            placeholder='********'
            name='password'
            type='password'
          />
          <Submit value='Sign in' busy={isPending} />
          <div className='flex justify-between'>
            <CustomLink to='/auth/forget-password'>Forget password</CustomLink>
            <CustomLink to='/auth/signup'>Sign up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}

export default Signin;
