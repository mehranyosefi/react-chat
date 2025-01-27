import { createContext, useContext, useState } from "react";

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, updateUser] = useState(null);

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
      }}
    >{children}</UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext)
  return context
}

export { UserProvider, useUser };

