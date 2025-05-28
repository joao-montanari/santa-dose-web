export default function getPhotoUser(){
    const userString = localStorage.getItem("user")
    const user = userString ? JSON.parse(userString) : null;

    // const baseURL = "http://localhost:8000/static"
    const baseURL ="https://fastapi-adega.onrender.com/static"
    
    const profileImageURL = `${baseURL}/${user.profile_image}`;
    
    return profileImageURL
}