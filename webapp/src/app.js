import Amplify, { API } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

async function uploadImage(formdata) {
    const apiName = 'cplabWebappApi';
    const path = '/image';
    const data = {
        body: formdata
    }
    return await API.post(apiName, path, data);
}

async function saveChecking(formdata) {
    const apiName = 'cplabWebappApi';
    const path = '/checking';
    const data = {
        body: {
            "image_id": "lena.jpg",
            "user_id": "michael.jackson",
            "correctness": true
        }
    }
    console.log('data: ' + JSON.stringify(data));
    return await API.post(apiName, path, data);
}

const MutationResult = document.getElementById("MutationResult");

const uploadForm = document.getElementById("uploadForm");
uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formdata = new FormData(uploadForm);
    for (const pair of formdata.entries()) {
        console.log('formdata: ' + pair[0] + ', ' + pair[1])
    }
    const result = await uploadImage(formdata);
    MutationResult.innerHTML += `<p>${JSON.stringify(result)}</p>`;
});

const MutationButton2 = document.getElementById("MutationEventButton2");
MutationButton2.addEventListener("click", async () => {
    const event = await saveChecking();
    MutationResult.innerHTML += `<p>${JSON.stringify(event)}</p>`;
});
