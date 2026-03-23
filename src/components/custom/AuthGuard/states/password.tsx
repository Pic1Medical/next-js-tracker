"use client";
import { Button } from "@/src/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import PasswordBox from "@/src/components/custom/PasswordBox";
import { signIn } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { Callout } from "@/src/components/custom/callout";
import { StateProps } from ".";
import { handleError } from "../../toaster";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function PasswordState({ setState }: Readonly<StateProps>) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormSchema) {
    await signIn({
      username: data.email,
      password: data.password,
      options: {
        preferredChallenge: "PASSWORD",
      },
    })
      .then(async (result) => {
        if (result.isSignedIn) {
          setState("signed-in");
          return;
        }
      })
      .catch((err) => {
        form.setError("root", {
          type: "validate",
          message: (err as Error).message,
        });
        handleError(err);
      });
  }

  return (
    <Card className="w-100">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldSet disabled={form.formState.isSubmitting}>
          <CardContent>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="mb-2">
                  <FieldLabel htmlFor={field.name}>
                    Email<span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="mb-2">
                  <FieldLabel htmlFor={field.name}>
                    Password<span className="text-destructive">*</span>
                  </FieldLabel>
                  <PasswordBox
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col">
            <Button
              type="submit"
              variant="outline"
              className="w-full"
            >
              Login
            </Button>
            {form.formState.errors.root && (
              <Callout variant="error">
                {form.formState.errors.root.message}
              </Callout>
            )}
          </CardFooter>
        </FieldSet>
      </form>
    </Card>
  );
}
