import React from "react";

export type User = null | {
  userId: string;
  username: string;
  email: string;
};

export const UserContext = React.createContext<{
  user: User;
  login: (user: User) => void;
  logout: () => void
}>({
  user: null,
  login: () => {},
  logout: () => {}
});