import { OTP_LENGTH } from "@/utils/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { resendEmailVerificationToken, verifyUserEmail } from "../../api/auth";
import { useAuth } from "../../hooks";
import FormContainer from "../form/FormContainer";
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
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { useTranslation } from "react-i18next";
import i18n from "@/utils/i18n";

const FormSchema = z.object({
  pin: z.string().min(OTP_LENGTH, {
    message: "Your OTP must be 6 characters.",
  }),
});

export default function EmailVerification() {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const { t } = useTranslation();

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

    if (error) return toast.error(t(error));

    toast.success(t(message));
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

    if (!isValidOTP(otp)) return toast.error(t("invalid OTP"));

    // submit OTP
    const {
      error,
      message,
      user: userResponse,
    } = await verifyUserEmail({
      OTP: otp.join(""),
      userId: user.id,
    });
    if (error) return toast.error(t(error));

    toast.success(t(message));
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
      return toast.error(t(error));
    }
    toast.success(t(message));
    localStorage.setItem("auth-token", userRep.token);
    isAuth();
  }

  return (
    <FormContainer>
      <Card>
        <CardHeader>{t("One-Time Password")}</CardHeader>
        <CardContent className="pb-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <div className="mx-auto">
                      {/* <FormLabel className="flex justify-center items-center mb-3 ">
                        One-Time Password
                      </FormLabel> */}
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
                      {t("Please enter the OTP sent to your email")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {t("Verify Account")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="">
          <Button
            variant="link"
            onClick={handleOTPResend}
            type="button"
            className="p-0 text-xs"
            // className=" text-blue-500 font-semibold h-2"
          >
            {t(`I don't have OTP`)}
          </Button>
        </CardFooter>
      </Card>
    </FormContainer>
  );
}
