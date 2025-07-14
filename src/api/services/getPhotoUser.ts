export default function getPhotoUser(){
    const userString = localStorage.getItem("user")
    const user = userString ? JSON.parse(userString) : null;
    console.log("User: ", user)

    const baseURL = `${import.meta.env.VITE_BACKEND_URL}/static`
    
    const profileImageURL = `${baseURL}/${user.profile_image}`;
    
    return profileImageURL
}