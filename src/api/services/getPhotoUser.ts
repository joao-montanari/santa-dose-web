export default function getPhotoUser(){
    const userString = localStorage.getItem("user")
    const user = userString ? JSON.parse(userString) : null;

    const baseURL = import.meta.env.VITE_BACKEND_URL_STATIC
    
    const profileImageURL = `${baseURL}/${user.profile_image}`;
    
    return profileImageURL
}