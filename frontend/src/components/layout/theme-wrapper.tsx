"use client";

import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";
import { PageLoader } from "./loader";
import { useCurrentUser } from "@/hooks/user/useUserDetails";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { data, isFetching } = useCurrentUser();

  const themeColor = data.clinicTheme || '#425469'

  if (isFetching) return <PageLoader />;

  const themeStyle = `
    :root {
      --primary: ${themeColor};
      --alpha: ${themeColor}; 
      --sidebar-primary: ${themeColor};
    }
  `;

  return (
    <>
      <Suspense fallback={null}>
        <NextTopLoader color={themeColor || "#425469"} height={5} showSpinner={false} />
      </Suspense>
      <style id="clinic-theme" dangerouslySetInnerHTML={{ __html: themeStyle }} />
      {children}
    </>
  );
}

export function AuthThemeWrapper({ children }: { children: React.ReactNode }) {

  const themeColor = '#425469'

  const themeStyle = `
    :root {
      --primary: ${themeColor};
      --alpha: ${themeColor}; 
      --sidebar-primary: ${themeColor};
    }
  `;

  return (
    <>
      <Suspense fallback={null}>
        <NextTopLoader color={themeColor || "#425469"} height={5} showSpinner={false} />
      </Suspense>
      <style id="clinic-theme" dangerouslySetInnerHTML={{ __html: themeStyle }} />
      {children}
    </>
  );
}
