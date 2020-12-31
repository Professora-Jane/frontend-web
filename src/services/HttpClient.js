import axios from "axios";

export default class HttpClientBuilder {

    static buildClient(options) {
        //configDefaultOptions(options);
        const client = axios.create(options);

        //default interceptor for request
        //TODO : refresh token
        client.interceptors.request.use(config => {
            return config;
        });

        client.interceptors.response.use(
            res => {
                return res;
            },
            error => {
                throw getProblemDetails(error);
            }
        );

        return client;
    }
}


// function configDefaultOptions(options) {
//     if (options.timeout === undefined) {
//         options.timeout = 300000;
//     }
//     if (options.headers === undefined) {
//         options.headers = {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//         };
//     }
// }

function getProblemDetails(error) {
    if (error && error.response && error.response.data) {
        return error.response.data;
    } 
    else {
        if (error && error.message) {
            return {
                type: "about:blank",
                title: error.message
            };
        }
    }
    return {
        type: "about:blank",
        title: "Ocorreu um erro de conexão. Tente novamente."
    };
}