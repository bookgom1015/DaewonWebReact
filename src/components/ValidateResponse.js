export default async function validateResponse(response) {
    if (response.status == 401 || response.status == 403) {
        console.log(response);
    }
    else {
        const data = await response.json();
        console.log(data);
    }
}