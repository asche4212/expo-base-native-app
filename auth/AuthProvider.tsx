import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";

interface AuthContextProps {
  user: any;
  token: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  loginWithPhoneNumber: (credentials: {
    phoneNumber: string;
    otp: string;
  }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  enableBiometricAuth: () => Promise<void>;
  isBiometricEnabled: boolean;
  enableBiometric: () => Promise<void>;
  isLoading: boolean;
  isLoggedIn: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "YOUR_EXPO_CLIENT_ID", // Replace with your Google OAuth client ID
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
  });
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const router = useRouter();

  // Load the session on app startup
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("jwtToken");
        if (storedToken) {
          setToken(storedToken);
          setUser({ id: 1, name: "User" }); // Mock user; replace with API call
        } else {
          router.replace("/auth/login");
        }
      } catch (error) {
        console.error("Failed to load session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, [router]);

  // Handle Google Login
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      // Exchange authentication.accessToken with your backend API to fetch user details
      setToken(authentication?.accessToken || "");
      setUser({ id: 1, name: "Google User" }); // Replace with actual user data
      router.replace("/home");
    }
  }, [response]);

  // Check if biometric authentication is available
  useEffect(() => {
    const checkBiometricAvailability = async () => {
      const hasBiometricLogin = await SecureStore.getItemAsync(
        "biometricEnabled"
      );
      const isHardwareAvailable = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricEnabled(!!hasBiometricLogin && isHardwareAvailable);
    };
    checkBiometricAvailability();
  }, []);

  // Enable biometric authentication
  const enableBiometric = async () => {
    await SecureStore.setItemAsync("biometricEnabled", "true");
    setIsBiometricEnabled(true);
  };

  const loginWithGoogle = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error("Google Login failed:", error);
    }
  };

  // Handle Apple Login
  const loginWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        ],
      });

      if (credential.identityToken) {
        // Replace with backend API call to exchange identityToken for a JWT
        setToken(credential.identityToken);
        setUser({
          id: 1,
          name: credential.fullName?.givenName || "Apple User",
        });
        router.replace("/home");
      }
    } catch (error: any) {
      if (error.code !== "ERR_CANCELED") {
        console.error("Apple Login failed:", error);
      }
    }
  };

  // Enable Biometric Authentication
  const enableBiometricAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        throw new Error(
          "Biometric authentication is not available or set up on this device."
        );
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with Biometrics",
      });

      if (result.success) {
        console.log("Biometric Authentication Successful");
        // You can store this information to re-prompt users later
      } else {
        console.log("Biometric Authentication Failed");
      }
    } catch (error) {
      console.error("Failed to enable biometric authentication:", error);
    }
  };

  // Login with email and password
  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      const fakeToken = "mock.jwt.token"; // Replace with your API call to authenticate
      await SecureStore.setItemAsync("jwtToken", fakeToken);
      setToken(fakeToken);
      setUser({ id: 1, name: "User" });
      router.replace("/home");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Login with email and password
  const loginWithPhoneNumber = async ({
    phoneNumber,
    otp,
  }: {
    phoneNumber: string;
    otp: string;
  }) => {
    try {
      setIsLoading(true);
      const fakeToken = "mock.jwt.token"; // Replace with your API call to authenticate
      await SecureStore.setItemAsync("jwtToken", fakeToken);
      setToken(fakeToken);
      setUser({ id: 1, name: "User" });
      router.replace("/home");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      await SecureStore.deleteItemAsync("jwtToken");
      setToken(null);
      setUser(null);
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLoggedIn = async () => {
    return !!token;
  }

  if (isLoading) {
    return null; // Show a splash screen or loader while checking session
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        loginWithPhoneNumber,
        loginWithGoogle,
        loginWithApple,
        logout,
        enableBiometricAuth,
        isLoading,
        isBiometricEnabled,
        enableBiometric,
        isLoggedIn
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
