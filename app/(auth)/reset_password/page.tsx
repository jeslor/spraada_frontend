import ResetPassword from "@/components/auth/ResetPassword";
import { redirect } from "next/navigation";
import {
  tokenExpiryCheck,
  userWithTokenExists,
} from "@/lib/actions/Auth.actions";

const page = async ({
  searchParams,
}: {
  searchParams: { token: string; email: string };
}) => {
  const params = await searchParams;

  const token = params.token;
  const email = params.email;
  if (!params.token || !params.email) {
    redirect("/");
  }

  //check whether the token and email are present
  const response = await userWithTokenExists(token, email);

  if (!response.exists) redirect("/");

  // set the validity value and message from the server
  let message = "";
  let tokenValid = false;

  try {
    const response = await tokenExpiryCheck(token, email);

    console.log(response);

    if (!response.valid) {
      message = "The reset token is invalid or has expired.";
      tokenValid = false;
    }
    tokenValid = response.valid;
  } catch (err) {
    message = "Error verifying reset token.";
    tokenValid = false;
  }

  return (
    <ResetPassword
      token={token}
      email={email}
      tokenValid={tokenValid}
      message={message}
    />
  );
};

export default page;
