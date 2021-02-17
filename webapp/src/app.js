import Amplify, { API, Auth } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

const loginPanel = document.getElementById("loginPanel");
const loginForm = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const registerButton = document.getElementById("registerButton");
const loginButton = document.getElementById("loginButton");
const confirmForm = document.getElementById("confirmForm");
const regCode = document.getElementById("regCode");
const sendRegCodeButton = document.getElementById("sendRegCodeButton");
const loginError = document.getElementById("loginError");
const mainPanel = document.getElementById("mainPanel");
const usernameLabel = document.getElementById("usernameLabel");
const signOutButton = document.getElementById("signOutButton");
const imageInput = document.getElementById("image");
const fileInput = document.getElementById("file");
const uploadForm = document.getElementById("uploadForm");
const checkForm = document.getElementById("checkForm");
const response = document.getElementById("response");

let currentUser = null;

Auth.currentAuthenticatedUser().then(user => setCurrentUser(user)).catch(error => console.log(error));

function setCurrentUser(user) {
    console.log(user);
    currentUser = user;
    usernameLabel.innerText = currentUser.attributes.email;
    loginPanel.classList.add("hidden");
    mainPanel.classList.remove("hidden");
}

function logLoginError(error) {
    console.error(error);
    loginError.innerText = error.message;
}

async function signIn() {
    try {
        setCurrentUser(await Auth.signIn(username.value, password.value));
        console.log("Login successful")
    } catch (error) {
        logLoginError(error);
    }
}

async function signUp() {
    try {
        await Auth.signUp({
            username: username.value,
            password: password.value,
            attributes: { email: username.value }
        });
        loginForm.classList.add("hidden");
        confirmForm.classList.remove("hidden");
        regCode.value = "";
    } catch (error) {
        logLoginError(error);
    }
}

async function confirmSignUp() {
    try {
        await Auth.confirmSignUp(username.value, regCode.value);
        signIn();
        loginForm.classList.remove("hidden");
        confirmForm.classList.add("hidden");
    } catch (error) {
        logLoginError(error);
    }
}

async function signOut() {
    try {
        await Auth.signOut();
        loginPanel.classList.remove("hidden");
        mainPanel.classList.add("hidden");
        username.value = "";
        password.value = "";
    } catch (error) {
        console.error(error);
    }
}

async function postForm(path, formdata) {
    const apiName = 'cplabWebappApi';
    for (const pair of formdata.entries()) {
        console.log('formdata: ' + pair[0] + ', ' + JSON.stringify(pair[1]))
    }
    return await API.post(apiName, path, { body: formdata });
}

registerButton.addEventListener("click", async (event) => {
    event.preventDefault();
    signUp();
})

loginButton.addEventListener("click", async (event) => {
    event.preventDefault();
    signIn();
});

sendRegCodeButton.addEventListener("click", async (event) => {
    event.preventDefault();
    confirmSignUp();
});

signOutButton.addEventListener("click", async () => {
    signOut();
});

fileInput.addEventListener("change", async () => {
    const filReader = new FileReader();

    filReader.addEventListener("load", () => {
        imageInput.value = filReader.result;
    });
    filReader.readAsDataURL(fileInput.files[0]);
});

uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formdata = new FormData(uploadForm);
    formdata.append("user_id", currentUser.attributes.email);
    const result = await postForm("/image", formdata);
    response.innerHTML += `<p>${JSON.stringify(result)}</p>`;
});

checkForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const correctness = {
        Yes: true,
        No: false
    }[event.submitter.value];

    const formdata = new FormData(checkForm);
    formdata.append("correctness", correctness);
    formdata.append("user_id", currentUser.attributes.email);
    const result = await postForm("/checking", formdata);
    response.innerHTML += `<p>${JSON.stringify(result)}</p>`;
});