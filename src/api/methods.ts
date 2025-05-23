import axios from "axios";

const axiosInstance = axios.create({
    // baseURL: "https://fastapi-adega.onrender.com",
    baseURL: "http://localhost:8000"
});

export async function selectMethod(
    url : string | undefined, 
    method : string | undefined, 
    body? : any
) {
    const token = localStorage.getItem("token");

    if (url === undefined || method === undefined) return {
        error : true,
        response : { message: "url or method undefined" }
    };

    const config = {
        headers : {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        }
    }

    const configEncoded = {
        headers : {
            Authorization: "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }

    const configMultipart = {
        headers : {
            Authorization: "Bearer " + token,
            "Content-Type" : "multipart/form-data"
        }
    }

    switch (method) {
        case "GET":
            try {
                const { data } = await axiosInstance.get(url, config);
                return data;
            } catch (error) {
                return { error: true, response: error };
            }

        case "POST_FORM_ENCODED":
            try {
                const postFormResponse = await axiosInstance.post(url, new URLSearchParams(body), configEncoded);
                return { error: false, response: postFormResponse.data };
            } catch (error) {
                // const errorResponse = error.response.data;
                // return { error: true, response: errorResponse };
                return { error: true, response: error };
            }

        case "POST":
            try {
                const postResponse = await axiosInstance.post(url, body, config);
                return { error: false, response: postResponse };
            } catch (error) {
                // const errorResponse = error.response.data;
                // return { error: true, response: postResponse };
                return { error: true, response: error };
            }

        case "PUT":
            try {
                const putResponse = await axiosInstance.put(url, body, config);
                return { error: false, response : putResponse };
            } catch (error) {
                return { error: true, response : error };
            }

        case "PATCH":
            try {
                const patchResponse = await axiosInstance.patch(url, body, config);
                return { error: false, response: patchResponse };
            } catch (error) {
                return { error: true, response: error };
            }

        case "DELETE":
            try {
                const deleteResponse = await axiosInstance.delete(url, config);
                return deleteResponse;
            } catch (error) {
                return { error: true, response: error };
            }
            // const deleteResponse = axiosInstance.delete(url, config);
            // return deleteResponse;

        case "MULTIPART_POST":
            try {
                const multipartPost = await axiosInstance.post(url, body, configMultipart);
                return { error: false, response: multipartPost };
            } catch (error) {
                // const errorMultipartPostResponse = error.response.data;
                // return { error: true, response: postResponse };
                return { error: true, response: error };
            }
    }
}