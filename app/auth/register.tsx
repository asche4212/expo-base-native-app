import { useAuth } from "@/auth/AuthProvider";
import { AUTH_CONFIG } from "@/config";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";

const RegisterScreen: React.FC = () => {
  const { loginWithGoogle, loginWithApple, enableBiometricAuth, isLoading } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      // Implement your registration API call here
      console.log("User registered successfully.");
      await enableBiometricAuth(); // Prompt the user to enable biometrics after registration
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>
      {AUTH_CONFIG.registrationOptions.emailAndPassword && (
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
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleRegister}
            disabled={isLoading}
            style={styles.input}
          >
            Register
          </Button>
        </>
      )}
      {AUTH_CONFIG.registrationOptions.phoneNumberOtp && (
        <>
          <Text style={styles.or}>OR</Text>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            label="Country"
            value={country}
            onChangeText={setCountry}
            style={styles.input}
          />
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
          <Button
            mode="contained"
            onPress={() => console.log("Register with OTP")}
            disabled={isLoading}
            style={styles.input}
          >
            Verify & Register
          </Button>
        </>
      )}
      {AUTH_CONFIG.registrationOptions.socialMedia && (
        <>
          <Text style={styles.or}>OR</Text>
          <Button
            icon="google"
            mode="contained"
            onPress={loginWithGoogle}
            disabled={isLoading}
            style={styles.input}
          >
            Register with Google
          </Button>
          <Button
            icon="apple"
            mode="contained"
            onPress={loginWithApple}
            disabled={isLoading}
            style={styles.input}
          >
            Register with Apple
          </Button>
        </>
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

export default RegisterScreen;
