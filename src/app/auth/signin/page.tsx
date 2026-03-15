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
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function SignInPage() {
  const router = useRouter();
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
          await router.push("/client/dashboard");
          return;
        }
      })
      .catch((err) => {
        form.setError("root", {
          type: "validate",
          message: (err as Error).message,
        });
      });
  }

  return (
    <Card className="w-100">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
        <CardAction>
          <Button variant="link">
            <InfoIcon aria-hidden />
            <span className="sr-only">What is this?</span>
          </Button>
        </CardAction>
      </CardHeader>
      <ErrorBoundary>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet disabled={form.formState.isSubmitting}>
            <CardContent>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
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
                  <Field>
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
              {form.formState.errors.root && (
                <div className="bg-destructive/20 text-black border border-l-2 border-destructive/40 border-l-destructive rounded-r px-2 py-2 mt-2">
                  {form.formState.errors.root.message}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                variant="outline"
                className="w-full"
              >
                Login
              </Button>
            </CardFooter>
          </FieldSet>
        </form>
      </ErrorBoundary>
    </Card>
  );
}
