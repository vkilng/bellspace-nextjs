import { createContext } from "react";
import { currentUserType } from "@/lib/customTypes";

export const CurrentUserContext = createContext<currentUserType | null>(null);
