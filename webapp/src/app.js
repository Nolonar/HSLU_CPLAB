import Amplify, { API, Auth } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

const apiName = 'cplabWebappApi';

const loadingOverlay = document.getElementById("loadingOverlay");
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
const classifyPanel = document.getElementById("classify");
const fileInput = document.getElementById("file");
const uploadForm = document.getElementById("uploadForm");
const imageInput = document.getElementById("image");
const checkPanel = document.getElementById("check");
const originalImage = document.getElementById("originalImage");
const classification = document.getElementById("classification");
const checkForm = document.getElementById("checkForm");
const imageId = document.getElementById("imageId");
const overallCorrect = document.getElementById("overallCorrect");
const overallIncorrect = document.getElementById("overallIncorrect");
const overallAccuracy = document.getElementById("overallAccuracy");
const userCorrect = document.getElementById("userCorrect");
const userIncorrect = document.getElementById("userIncorrect");
const userAccuracy = document.getElementById("userAccuracy");
const response = document.getElementById("response");

let currentUser = null;

Auth.currentAuthenticatedUser().then(user => {
    setCurrentUser(user);
    updateStatistics();
}).catch(error => console.log(error));

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

function logError(error) {
    console.log(error);
    response.classList.add("error");
    if (!error.code) {
        response.innerText = error.message;
    } else {
        response.innerText = `${error.code}: ${error.message}`;
    }
}

async function showLoadingOverlay(callback) {
    response.innerText = "";
    response.classList.remove("error");

    loadingOverlay.classList.remove("hidden");
    const result = await callback();
    loadingOverlay.classList.add("hidden");

    return result;
}

async function signIn() {
    showLoadingOverlay(async () => {
        try {
            setCurrentUser(await Auth.signIn(username.value, password.value));
            updateStatistics();
            console.log("Login successful");
        } catch (error) {
            logLoginError(error);
        }
    });
}

async function signUp() {
    showLoadingOverlay(async () => {
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
    });
}

async function confirmSignUp() {
    showLoadingOverlay(async () => {
        try {
            await Auth.confirmSignUp(username.value, regCode.value);
            signIn();
            loginForm.classList.remove("hidden");
            confirmForm.classList.add("hidden");
        } catch (error) {
            logLoginError(error);
        }
    });
}

async function signOut() {
    showLoadingOverlay(async () => {
        try {
            await Auth.signOut();
            currentUser = null;

            loginPanel.classList.remove("hidden");
            mainPanel.classList.add("hidden");
            username.value = "";
            password.value = "";
        } catch (error) {
            console.error(error);
        }
    });
}

function getAccuracy(correct, incorrect) {
    const total = correct + incorrect;
    return total ? (100 * correct / total).toFixed(0) : 0;
}

async function updateStatistics() {
    if (!currentUser) {
        return;
    }

    let statistics = null;
    try {
        statistics = await API.get(apiName, "/statistic", {
            queryStringParameters: {
                username: currentUser.attributes.email
            }
        });
        console.log(statistics);
    } catch (error) {
        logError(error);
        return;
    }
    overallCorrect.innerText = statistics.correctOverall;
    overallIncorrect.innerText = statistics.wrongOverall;
    overallAccuracy.innerText = `${getAccuracy(statistics.correctOverall, statistics.wrongOverall)}%`;

    userCorrect.innerText = statistics.correctUser;
    userIncorrect.innerText = statistics.wrongUser;
    userAccuracy.innerText = `${getAccuracy(statistics.correctUser, statistics.wrongUser)}%`;
}

async function postForm(path, formdata) {
    for (const pair of formdata.entries()) {
        console.log('formdata: ' + pair[0] + ', ' + JSON.stringify(pair[1]))
    }

    return await showLoadingOverlay(async () => {
        try {
            const result = await API.post(apiName, path, { body: formdata });
            if (!result.statusCode) {
                return result;
            }
            logError(result);
        } catch (error) {
            logError(error);
        }
        return null;
    });
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
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        imageInput.value = reader.result;
        originalImage.style.backgroundImage = `url(${reader.result})`;
    });
    reader.readAsDataURL(fileInput.files[0]);
});

uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formdata = new FormData(uploadForm);
    formdata.append("userId", currentUser.attributes.email);
    const result = await postForm("/image", formdata);
    if (result) {
        console.log(result);
        imageId.value = result.filename;
        classification.innerText = result.category;
        classifyPanel.classList.add("hidden");
        checkPanel.classList.remove("hidden");
    }
});

checkForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const correctness = {
        Yes: true,
        No: false
    }[event.submitter.value];

    const formdata = new FormData(checkForm);
    formdata.append("userId", currentUser.attributes.email);
    formdata.append("correctness", correctness);
    const result = await postForm("/checking", formdata);
    updateStatistics();

    fileInput.value = "";
    classifyPanel.classList.remove("hidden");
    checkPanel.classList.add("hidden");

    console.log(result);
});