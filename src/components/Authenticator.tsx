import {
  AuthenticatorProps,
  View,
  Authenticator as _Authenticator,
  useTheme,
} from "@aws-amplify/ui-react";
import Image from "next/image";
import Logo from "@assets/pic1medical-logo.png";

const components: AuthenticatorProps["components"] = {
  Header() {
    const { tokens } = useTheme();
    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Image
          alt="Pic1Medical logo"
          width={230}
          className="bg-light rounded px-4 py-3"
          src={Logo}
        />
      </View>
    );
  },
  SignUp: {
    Header() {
      return <></>;
    },
    FormFields() {
      return (
        <>
          <p>
            Pic1Medical Tracker is not a public application; user creation is
            not possible via this portal. If you believe that you require an
            account please contact Pic1Medical directly to get an account
            created.
          </p>
        </>
      );
    },
    Footer() {
      return <></>;
    },
  },
};

export default function Authenticator({
  children,
}: Omit<AuthenticatorProps, "components" | "formFields">) {
  return <_Authenticator {...{ components }}>{children}</_Authenticator>;
}
