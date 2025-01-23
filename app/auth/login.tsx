import { useAuth } from "@/auth/AuthProvider";
import { AUTH_CONFIG } from "@/config";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";

const LoginScreen: React.FC = () => {
  const {
    login,
    loginWithPhoneNumber,
    loginWithGoogle,
    loginWithApple,
    enableBiometricAuth,
    isLoading,
    isBiometricEnabled,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const handleLogin = async () => {
    try {
      await login({ email, password });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handlePhoneLogin = async () => {
    try {
      await loginWithPhoneNumber({ phoneNumber, otp });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      await enableBiometricAuth();
    } catch (error) {
      console.error("Biometric Authentication error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      {AUTH_CONFIG.loginOptions.emailAndPassword && (
        <>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button mode="contained" onPress={handleLogin}>
            Login
          </Button>
        </>
      )}

      {AUTH_CONFIG.loginOptions.phoneNumberOtp && (
        <>
          <Text style={styles.or}>OR</Text>
          <TextInput
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TextInput
            label="OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button mode="contained" onPress={handlePhoneLogin}>
            Verify OTP
          </Button>
        </>
      )}

      {AUTH_CONFIG.loginOptions.socialMedia && (
        <>
          <Text style={styles.or}>OR</Text>
          <Button icon="google" mode="contained" onPress={loginWithGoogle}>
            Login with Google
          </Button>
          <Button icon="apple" mode="contained" onPress={loginWithApple}>
            Login with Apple
          </Button>
        </>
      )}

      {AUTH_CONFIG.loginOptions.biometric && isBiometricEnabled && (
        <Button
          icon="fingerprint"
          mode="outlined"
          onPress={handleBiometricAuth}
        >
          Use Biometric Login
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  or: {
    textAlign: "center",
    marginVertical: 8,
    fontSize: 16,
    color: "gray",
  },
});

export default LoginScreen;
