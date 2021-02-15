import Amplify, { API } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

async function uploadImage(data) {
    const apiName = 'cplabWebappApi';
    const path = '/image';
    return await API.post(apiName, path, data);
}

async function saveChecking(data) {
    const apiName = 'cplabWebappApi';
    const path = '/checking';
    data = {
        body: {
            "image_id": "lena.jpg",
            "user_id": "michael.jackson",
            "correctness": true
        }
    }
    console.log('data: ' + data)
    return await API.post(apiName, path, data);
}

const uploadForm = document.getElementById("uploadForm");
uploadForm.addEventListener("submit", async (event) => {
    const formdata = new FormData(uploadForm);
    uploadImage(formdata);
    event.preventDefault();
});

const MutationResult = document.getElementById("MutationResult");

const MutationButton = document.getElementById("MutationEventButton");
MutationButton.addEventListener("click", async () => {
    const event = await uploadImage();
    MutationResult.innerHTML += `<p>${event}</p>`;
});

const MutationButton2 = document.getElementById("MutationEventButton2");
MutationButton2.addEventListener("click", async () => {
    const event = await saveChecking();
    MutationResult.innerHTML += `<p>${event}</p>`;
});
