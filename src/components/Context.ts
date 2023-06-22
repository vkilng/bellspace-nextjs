import { createContext } from "react";
import { currentUserType, pageBannerObj } from "../lib/customTypes";

export const CurrentUserContext = createContext<currentUserType | null>(null);

export const PageBannerContext = createContext<{
  bannerContent: pageBannerObj | null;
  setBannerContent: (content: pageBannerObj | null) => void;
}>({
  bannerContent: { icon: "home", text: "Home" },
  setBannerContent: () => {},
});
