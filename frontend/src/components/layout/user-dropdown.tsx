"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import UserDropDownPatient from "./UserDropDownPatient";
import UserDropDownClinic from "./UserDropDownClinic";

export default function UserDropDown() {
  const path = usePathname();

  const mode: "patient" | "clinic" | "none" = React.useMemo(() => {
    if (path.startsWith("/dashboard/patient")) return "patient";
    if (path.startsWith("/dashboard/clinic")) return "clinic";
    return "none";
  }, [path]);

  if (mode === "clinic") return <UserDropDownClinic />;

  return <UserDropDownPatient />;
}
