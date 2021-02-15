import Amplify, { API } from "aws-amplify";
import awsconfig from "./aws-exports";


Amplify.configure(awsconfig);

function callApi(method, data) {
    if (!(method in ["get, post"])) {
        console.error(`Invalid API call: ${method}`)
        return;
    }

    const apiName = 'restapi';
    const path = '/items';
    return await API[method](apiName, path, data);
}

function get(data) {
    return callApi("get", data);
}

function post(data) {
    return callApi("post", data);
}

const MutationButton = document.getElementById("MutationEventButton");
const MutationResult = document.getElementById("MutationResult");

MutationButton.addEventListener("click", (evt) => {
    createNewTodo().then((evt) => {
        MutationResult.innerHTML += `<p>${evt.data.createTodo.name} - ${evt.data.createTodo.description}</p>`;
    });
});