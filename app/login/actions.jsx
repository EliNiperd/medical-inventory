"use server";

//import { getURL } from "@/lib/getURL";
//import { prisma } from "@/app/lib/prisma";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { schemaLogin } from "@/lib/schemas/login";


export async function authenticate(prevState, formData) {
  try {
    //console.log("formData.email: ", formData.get('email'));
    const validatedFields = schemaLogin.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    })
    // Return early if the form data is invalid
    /*if (!validatedFields.success) {
      //console.log(validatedFields.error);
      // refine errors
      const { issues } = validatedFields.error;
      let errors = [];
      for (var i = 0; i < issues.length; i++) {
        errors.push({ for: issues[i].path[0], message: issues[i].message });
      }
      return {
        errors: errors,
      }*/
    //console.log(validatedFields);
    if (!validatedFields.success) {
      return {
        type: "error",
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Please enter a valid email and password.",
      }

    }
    else
      await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      //console.log("error: ", error);
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
