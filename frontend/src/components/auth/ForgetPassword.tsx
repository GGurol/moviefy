import { useState } from "react";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";
import { forgetPassword } from "../../api/auth";
import { isValidEmail } from "../../utils/helper";
import { useNotification } from "../../hooks";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const formSchema = z.object({
  email: z.string().email(),
});

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const { updateNotification } = useNotification();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleChange = ({ target }) => {
    const { value } = target;
    setEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email))
      return updateNotification("error", "Invalid email!");
    const { error, message } = await forgetPassword(email);
    if (error) return updateNotification("error", error);
    updateNotification("success", message);
  };

  return (
    // <FormContainer>
    //   <Container>
    //     <form onSubmit={handleSubmit} className={commonModalClasses + " w-96"}>
    //       <Title>Please Enter Your Email</Title>
    //       <FormInput
    //         onChange={handleChange}
    //         value={email}
    //         label="Email"
    //         placeholder="john@email.com"
    //         name="email"
    //       />
    //       <Submit value="Send Link" />
    //       <div className="flex justify-between">
    //         <CustomLink to="/auth/signin">Sign in</CustomLink>
    //         <CustomLink to="/auth/signup">Sign up</CustomLink>
    //       </div>
    //     </form>
    //   </Container>
    // </FormContainer>
    <Card className="w-80 mx-auto mt-48">
      <CardHeader>
        <CardTitle className="text-xl">Please Enter Your Email</CardTitle>
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full">Send Link</Button>
            <div className="flex justify-between">
              <Button variant="link" asChild>
                <Link to="/auth/signin">Log in</Link>
              </Button>
              <Button variant="link">
                <Link to="/auth/signup">Sign up</Link>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
