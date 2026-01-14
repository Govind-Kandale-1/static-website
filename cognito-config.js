// AWS Cognito Configuration
// Works with CDN: https://cdn.jsdelivr.net/npm/oidc-client-ts@3.4.1/dist/oidc-client-ts.umd.js

// Configure your Cognito settings
const cognitoAuthConfig = {
    authority: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_ZNOUbbPev",
    client_id: "mnfsk8vfar8782sns0kgr134t",
    redirect_uri: "https://govind-kandale-1.github.io/static-website",
    response_type: "code",
    scope: "phone openid email"
};

// Create a UserManager instance using the global OidcClientTS from CDN
const userManager = new window.OidcClientTS.UserManager({
    ...cognitoAuthConfig,
});

// Make available globally
window.userManager = userManager;

// Sign out function - redirects to Cognito logout endpoint
window.signOutRedirect = async function() {
    const clientId = "mnfsk8vfar8782sns0kgr134t";
    const logoutUri = "https://govind-kandale-1.github.io/static-website"; // Your GitHub Pages logout URL
    const cognitoDomain = "https://eu-north-1znoubbpev.auth.eu-north-1.amazoncognito.com"; // Your Cognito domain
    
    // Clear user from local storage
    try {
        await userManager.clearStaleState();
        await userManager.removeUser();
    } catch (error) {
        console.error("Error clearing user state:", error);
    }
    
    // Redirect to Cognito logout endpoint
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};

// Get user profile information
window.getUserProfile = async function() {
    try {
        const user = await userManager.getUser();
        return user;
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
    }
};

// Check if user is authenticated
window.isUserAuthenticated = async function() {
    try {
        const user = await userManager.getUser();
        return user && !user.expired;
    } catch (error) {
        console.error("Error checking authentication:", error);
        return false;
    }
};

// Refresh access token if needed
window.refreshAccessToken = async function() {
    try {
        const user = await userManager.getUser();
        if (user && user.expired) {
            const newUser = await userManager.signinSilent();
            return newUser;
        }
        return user;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
    }
};
