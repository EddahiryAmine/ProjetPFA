// src/contexts/ProfileStatusContext.js
import { createContext, useContext, useState } from 'react';

export const ProfileStatusContext = createContext();

export const useProfileStatus = () => useContext(ProfileStatusContext);

export const ProfileStatusProvider = ({ children }) => {
  const [profileComplete, setProfileComplete] = useState(null);

  return (
    <ProfileStatusContext.Provider value={{ profileComplete, setProfileComplete }}>
      {children}
    </ProfileStatusContext.Provider>
  );
};
