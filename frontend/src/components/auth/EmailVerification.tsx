import { useEffect, useRef, useState } from "react";
import Container from "../Container";
import Submit from "../form/Submit";
import Title from "../form/Title";
import FormContainer from "../form/FormContainer";
import { commonModalClasses } from "../../utils/theme";
import { useLocation, useNavigate } from "react-router-dom";
import { resendEmailVerificationToken, verifyUserEmail } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";

const OTP_LENGTH = 4;
let currentOTPIndex;

const isValidOTP = (otp) => {
  let valid = false;

  for (let val of otp) {
    valid = !isNaN(parseInt(val));
    if (!valid) break;
  }

  return valid;
};

function EmailVerification() {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);

  const { isAuth, authInfo } = useAuth();
  const { isLoggedIn, profile } = authInfo;
  const isVerified = profile?.isVerified;

  const inputRef = useRef();
  const { updateNotification } = useNotification();

  const { state } = useLocation();
  // const location = useLocation();
  // console.log(location);
  const user = state?.user;

  const navigate = useNavigate();

  const focusPrevInputField = (index) => {
    // let nextIndex;
    // const diff = index - 1;
    // nextIndex = diff !== 0 ? diff : 0;
    // setActiveOtpIndex(nextIndex);
    setActiveOtpIndex(index - 1); // still working!
  };

  const focusNextInputField = (index) => {
    setActiveOtpIndex(index + 1);
  };

  const handleOtpChange = ({ target }) => {
    const { value } = target;
    const newOpt = [...otp];
    newOpt[currentOTPIndex] = value.substring(value.length - 1, value.length);
    // console.log(value);
    if (!value) focusPrevInputField(currentOTPIndex);
    else focusNextInputField(currentOTPIndex);

    setOtp([...newOpt]);
  };

  const handleOTPResend = async () => {
    const { error, message } = await resendEmailVerificationToken(user.id);

    if (error) return updateNotification("error", error);

    updateNotification("success", message);
  };

  const handleKeyDown = ({ key }, index) => {
    // console.log(key);
    currentOTPIndex = index;
    if (key === "Backspace") {
      focusPrevInputField(currentOTPIndex);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidOTP(otp)) return updateNotification("error", "invalid OTP");

    // submit OTP
    const {
      error,
      message,
      user: userResponse,
    } = await verifyUserEmail({
      OTP: otp.join(""),
      userId: user.id,
    });
    if (error) return updateNotification("error", error);

    updateNotification("success", message);
    localStorage.setItem("auth-token", userResponse.token);
    isAuth();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    if (!user) navigate("/not-found");
    if (isLoggedIn && isVerified) navigate("/");
  }, [user, isLoggedIn, isVerified]);
  // if (!user) return null;

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses}>
          <div>
            <Title>Please enter the OTP to verify your account </Title>
            <p className='text-center dark:text-dark-subtle text-light-subtle'>OTP has been sent to your email</p>
          </div>
          <div className='flex justify-center items-center space-x-4'>
            {otp.map((_, i) => {
              return (
                <input
                  ref={activeOtpIndex === i ? inputRef : null}
                  key={i}
                  type='number'
                  value={otp[i] || ""}
                  onChange={handleOtpChange}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className='w-12 h-12 border-2 dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary rounded bg-transparent outline-none text-center dark:text-white text-primary font-semibold text-xl spin-button-none'
                />
              );
            })}
          </div>
          <div>
            <Submit value='Verify Account' />
            <button
              onClick={handleOTPResend}
              type='button'
              className='dark:text-white text-blue-500 font-semibold hover:underline mt-2'
            >{`I don't have OTP`}</button>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}

export default EmailVerification;
