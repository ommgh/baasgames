import { ID } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";
import { cookies } from "next/headers";

import { getLoggedInUser } from "@/lib/appwrite";
import { redirect } from "next/navigation";
import { signUpWithGoogle } from "@/lib/oauth";

async function signUpWithEmail(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const { account } = await createAdminClient();

  await account.create(ID.unique(), email, password, name);
  const session = await account.createEmailPasswordSession(email, password);

  cookies().set("my-custom-session", session.secret, {
    path: "/",
    sameSite: "strict",
    httpOnly: true,
    secure: true,
  });

  redirect("/profile");
}

export default async function SignUpPage() {
  const user = await getLoggedInUser();
  if (user) redirect("/account");

  return (
    <>
      <form action={signUpWithGoogle}>
        <button type="submit">Sign up with Google</button>
      </form>
      <form action={signUpWithEmail}>
        <input id="email" name="email" placeholder="Email" type="email" />
        <input
          id="password"
          name="password"
          placeholder="Password"
          minLength={8}
          type="password"
        />
        <input id="name" name="name" placeholder="Name" type="text" />
        <button type="submit">Sign up</button>
      </form>
    </>
  );
}
