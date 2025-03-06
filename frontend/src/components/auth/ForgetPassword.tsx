import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { forgetPassword } from "../../api/auth";
import { isValidEmail } from "../../utils/helper";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgetPassword() {
  // const [email, setEmail] = useState("");
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // const handleChange = ({ target }) => {
  //   const { value } = target;
  //   setEmail(value);
  // };

  const handleSubmit = async (value) => {
    // e.preventDefault();
    // if (!isValidEmail(value)) return toast.error(t("Invalid email address"));
    const { error, message } = await forgetPassword(value.email);
    if (error) return toast.error(error);
    toast.success(message);
  };

  return (
    <Card className="w-80 mx-auto mt-48">
      <CardHeader>
        <CardTitle className="text-xl">
          {t("Please Enter Your Email")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Email")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full">{t("Send password reset link")}</Button>
            <div className="flex justify-between">
              <Button variant="link" asChild>
                <Link to="/auth/signin">{t("Log in")}</Link>
              </Button>
              <Button variant="link">
                <Link to="/auth/signup">{t("Sign up")}</Link>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
