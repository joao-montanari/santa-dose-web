
export type User = {
    idUsuario : number | null,
    username : string,
    email: string,
    senha : string,
    is_admin: boolean,
    profileImage: File | string | null
}

export type Auth = {
    username : string,
    password : string,
}