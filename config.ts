export const AUTH_CONFIG = {
    loginOptions: {
        emailAndPassword: true,
        phoneNumberOtp: true,
        socialMedia: true, // Includes Google and Apple
        biometric: true, // Enabled if the user logged in previously
    },
    registrationOptions: {
        emailAndPassword: true,
        phoneNumberOtp: true,
        socialMedia: true,
    },
};
