import Amplify, { API, Auth } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

const response = document.getElementById("response");
const imageInput = document.getElementById("image");
const fileInput = document.getElementById("file");
const uploadForm = document.getElementById("uploadForm");
const checkForm = document.getElementById("checkForm");
const loginForm = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const loginButton = document.getElementById("loginButton");

let user = null;

async function signIn() {
    try {
        user = await Auth.signIn(username.value, password.value);
        console.log(user);
        return true;
    } catch (error) {
        console.log("error:");
        console.log(error);
        return false;
    }
}

async function postForm(path, formdata) {
    const apiName = 'cplabWebappApi';
    for (const pair of formdata.entries()) {
        console.log('formdata: ' + pair[0] + ', ' + JSON.stringify(pair[1]))
    }
    return await API.post(apiName, path, { body: formdata });
}

loginButton.addEventListener("click", async(event) => {
    event.preventDefault();
    if (await signIn()) {
        loginForm.classList.add('hidden');
        console.log('successful login')
    } else {
        console.log('ooops...')
    }
});

fileInput.addEventListener("change", async() => {
    const filReader = new FileReader();

    filReader.addEventListener("load", () => {
        imageInput.value = filReader.result;
    });
    filReader.readAsDataURL(fileInput.files[0]);
});

uploadForm.addEventListener("submit", async(event) => {
    event.preventDefault();
    const formdata = new FormData(uploadForm);
    formdata.append("user_id", username.value); // TODO: get username
    const result = await postForm("/image", formdata);
    response.innerHTML += `<p>${JSON.stringify(result)}</p>`;
});

checkForm.addEventListener("submit", async(event) => {
    event.preventDefault();

    const correctness = {
        Yes: true,
        No: false
    }[event.submitter.value];

    const formdata = new FormData(checkForm);
    formdata.append("correctness", correctness);
    formdata.append("user_id", username.value); // TODO: get username
    const result = await postForm("/checking", formdata);
    response.innerHTML += `<p>${JSON.stringify(result)}</p>`;
});