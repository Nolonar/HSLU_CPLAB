import Amplify, { API } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

async function postForm(path, formdata) {
    const apiName = 'cplabWebappApi';
    for (const pair of formdata.entries()) {
        console.log('formdata: ' + pair[0] + ', ' + JSON.stringify(pair[1]))
    }
    return await API.post(apiName, path, { body: formdata });
}

const response = document.getElementById("response");
const imageInput = document.getElementById("image");
const fileInput = document.getElementById("file");
const uploadForm = document.getElementById("uploadForm");
const checkForm = document.getElementById("checkForm");

fileInput.addEventListener("change", () => {
    const filReader = new FileReader();

    filReader.addEventListener("load", () => {
        imageInput.value = filReader.result;
    });
    filReader.readAsDataURL(fileInput.files[0]);
});

uploadForm.addEventListener("submit", async(event) => {
    event.preventDefault();
    const result = await postForm("/image", new FormData(uploadForm));
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

    const result = await postForm("/checking", formdata);
    response.innerHTML += `<p>${JSON.stringify(result)}</p>`;
});