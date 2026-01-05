import { emailLoginProviders } from "../constants/email_providers";

export const getEmailProviderUrl = (email: string): string | undefined => {
  const domain = email.split("@")[1];
  return emailLoginProviders.find((p) => {
    const extensions = Array.isArray(p.extension) ? p.extension : [p.extension];
    return extensions.some((ext) => ext === domain);
  })?.emailUrl;
};
