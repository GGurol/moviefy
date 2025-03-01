import { useEffect, useRef, useState } from "react";
import Container from "../Container";
import Submit from "../form/Submit";
import Title from "../form/Title";
import FormContainer from "../form/FormContainer";
import { commonModalClasses } from "../../utils/theme";
import { useLocation, useNavigate } from "react-router-dom";
import { resendEmailVerificationToken, verifyUserEmail } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";
import { z } from "zod";
import { OTP_LENGTH } from "@/utils/helper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { toast } from "sonner";

// let currentOTPIndex;

// const isValidOTP = (otp) => {
//   let valid = false;

//   for (let val of otp) {
//     valid = !isNaN(parseInt(val));
//     if (!valid) break;
//   }

//   return valid;
// };

const FormSchema = z.object({
  pin: z.string().min(OTP_LENGTH, {
    message: `Your one-time password must be ${OTP_LENGTH} characters.`,
  }),
});

function EmailVerification() {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);

  const { isAuth, authInfo } = useAuth();
  const { isLoggedIn, profile } = authInfo;
  const isVerified = profile?.isVerified;

  const inputRef = useRef();

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

    if (error) return toast.error(error);

    toast.success(message);
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

    if (!isValidOTP(otp)) return toast.error("invalid OTP");

    // submit OTP
    const {
      error,
      message,
      user: userResponse,
    } = await verifyUserEmail({
      OTP: otp.join(""),
      userId: user.id,
    });
    if (error) return toast.error(error);

    toast.success(message);
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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const {
      error,
      message,
      user: userRep,
    } = await verifyUserEmail({
      OTP: data.pin,
      userId: user.id,
    });
    if (error) {
      return toast.error(error);
    }
    toast.success(message);
    localStorage.setItem("auth-token", userRep.token);
    isAuth();
  }

  return (
    <FormContainer>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <div className="mx-auto">
                  <FormLabel className="flex justify-center items-center mb-3 ">
                    One-Time Password
                  </FormLabel>
                  <FormControl className="">
                    <InputOTP maxLength={6} {...field} className="">
                      <InputOTPGroup className="mx-auto">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                </div>

                <FormDescription>
                  Please enter the one-time password sent to your email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Verify Account
          </Button>

          <Button
            variant="link"
            onClick={handleOTPResend}
            type="button"
            className=" text-blue-500 font-semibold h-2"
          >
            {`I don't have OTP`}
          </Button>
        </form>
      </Form>
    </FormContainer>

    // <FormContainer>
    //   <Container>
    //     <form onSubmit={handleSubmit} className={commonModalClasses}>
    //       <div>
    //         <Title>Please enter the OTP to verify your account </Title>
    //         <p className='text-center dark:text-dark-subtle text-light-subtle'>OTP has been sent to your email</p>
    //       </div>
    //       <div className='flex justify-center items-center space-x-4'>
    //         {otp.map((_, i) => {
    //           return (
    //             <input
    //               ref={activeOtpIndex === i ? inputRef : null}
    //               key={i}
    //               type='number'
    //               value={otp[i] || ""}
    //               onChange={handleOtpChange}
    //               onKeyDown={(e) => handleKeyDown(e, i)}
    //               className='w-12 h-12 border-2 dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary rounded bg-transparent outline-none text-center dark:text-white text-primary font-semibold text-xl spin-button-none'
    //             />
    //           );
    //         })}
    //       </div>
    //       <div>
    //         <Submit value='Verify Account' />
    //         <button
    //           onClick={handleOTPResend}
    //           type='button'
    //           className='dark:text-white text-blue-500 font-semibold hover:underline mt-2'
    //         >{`I don't have OTP`}</button>
    //       </div>
    //     </form>
    //   </Container>
    // </FormContainer>
  );
}

export default EmailVerification;
