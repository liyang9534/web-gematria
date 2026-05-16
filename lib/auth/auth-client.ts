import { emailOTPClient, lastLoginMethodClient, magicLinkClient, oneTapClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authBaseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL;

export const authClient = createAuthClient({
  ...(authBaseURL ? { baseURL: authBaseURL } : {}),
  plugins: [
    ...(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? [oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      // Optional client configuration:
      autoSelect: false,
      cancelOnTapOutside: true,
      context: "signin",
      additionalOptions: {
        use_fedcm_for_prompt: process.env.NODE_ENV === "production"
      },
      promptOptions: {
        fedCM: false, // Force better-auth to use the Google JS script (which respects additionalOptions)
      }
    })] : []),
    magicLinkClient(),
    emailOTPClient(),
    lastLoginMethodClient()
  ]
})
