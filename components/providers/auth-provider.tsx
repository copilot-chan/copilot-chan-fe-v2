"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged, 
  getIdToken, 
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, 
      async (currentUser) => {

        setUser(currentUser);
        
        if (currentUser) {
          const idToken = await getIdToken(currentUser);
          setToken(idToken);
          console.log("User UID:", currentUser.uid);
          console.log("User Token:", idToken);
        } 
        
        else {
          setToken(null);
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      //await signInAnonymously(auth);
      //dang nhap bang google
      setLoading(true);
      const credential = await signInWithPopup(auth,new GoogleAuthProvider())

      //set user va token
      const user=credential.user;
      const idToken = await getIdToken(user);
      setUser(user);
      setToken(idToken);
      setLoading(false);

    } 
    
    catch (error) {
      setLoading(false);
      console.error("Login failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
