import Amplify, { API } from "aws-amplify";
import awsconfig from "./aws-exports";


Amplify.configure(awsconfig);

async function uploadImage(data) {
    const apiName = 'cplabWebappApi';
    const path = '/image';
    return await API.post(apiName, path, data);
}

const MutationButton = document.getElementById("MutationEventButton");
const MutationResult = document.getElementById("MutationResult");

MutationButton.addEventListener("click", async () => {
    const event = await uploadImage();
    MutationResult.innerHTML += `<p>${event}</p>`;
});
