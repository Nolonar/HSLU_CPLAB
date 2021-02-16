import Amplify, { API } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

async function postForm(path, formdata) {
    const apiName = 'cplabWebappApi';
    for (const pair of formdata.entries()) {
        console.log('formdata: ' + pair[0] + ', ' + pair[1])
    }

    return await API.post(apiName, path, { body: formdata });
}

const response = document.getElementById("response");

const uploadForm = document.getElementById("uploadForm");
uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const result = await postForm("/image", new FormData(uploadForm));
    response.innerHTML += `<p>${JSON.stringify(result)}</p>`;
});

const checkForm = document.getElementById("checkForm");
checkForm.addEventListener("submit", async (event) => {
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
