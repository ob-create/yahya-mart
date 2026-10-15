"use strict";

const DEMO_ADMIN_PASSWORD = "YahyaMart@2026";
const LOGIN_KEY = "yahyaMartDemoAdminLoggedIn";

const form = document.querySelector("#loginForm");
const passwordInput = document.querySelector("#adminPassword");
const message = document.querySelector("#loginMessage");
const button = document.querySelector("#loginButton");

// If already logged in during this browser tab session, open the dashboard.
if (sessionStorage.getItem(LOGIN_KEY) === "true") {
    window.location.replace("admin.html");
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const enteredPassword = passwordInput.value;

    if (enteredPassword === DEMO_ADMIN_PASSWORD) {
        sessionStorage.setItem(LOGIN_KEY, "true");
        message.textContent = "";
        button.disabled = true;
        button.textContent = "Signing in...";

        window.location.replace("admin.html");
        return;
    }

    message.textContent = "Incorrect password. Please try again.";
    passwordInput.value = "";
    passwordInput.focus();
});