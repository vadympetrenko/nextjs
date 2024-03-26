"use client";
import { Card } from "@/UI/Card";
import classes from "@/app/components/SignIn/SignIn.module.scss";
import { Input } from "@/UI/Input";
import { signIn } from "next-auth/react";
import { Button } from "@/UI/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/useToast";
import { isRequired } from "@/lib/isFieldRequired";

export type UserType = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export const SignIn = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserType>({
    defaultValues: {
      email: undefined,
      password: undefined,
    },
    resolver: yupResolver(schema),
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<UserType> = async (formData) => {
    const response = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (response?.ok) {
      toast("You've signed in", "success");
      router.push("/");
    } else {
      toast("This password does not match your email address.", "error");
    }
  };

  return (
    <Card className="login">
      <h1>Welcome</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          name="email"
          placeholder="Email"
          control={control}
          errors={errors}
          isRequired={isRequired({ name: "email", schema })}
        />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          control={control}
          errors={errors}
          isRequired={isRequired({ name: "password", schema })}
        />
        <Button variation="full-width" className={classes.loginButton}>
          Login
        </Button>
      </form>
    </Card>
  );
};
