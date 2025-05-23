import { User } from '@Models/user';
import { selectMethod } from '@Api/methods';
import { findRouter }  from '@Api/mapRouters';

export async function createUser(user : FormData) {
    let request = await findRouter("createUser");

    return selectMethod(
        request.router,
        request.method,
        user
    );
}

export async function listUsers() {
    let request = await findRouter("listUsers");

    return selectMethod(
        request.router,
        request.method,
    );
}

export async function getUser(id : number) {
    let request = await findRouter("getUser");
    let url : string = `${request.router}${id}`

    return selectMethod(
        url,
        request.method,
    );
}

export async function putUser(user : User) {
    let request = await findRouter("putUser");
    let url : string = `${request.router}${user.idUsuario}`

    return selectMethod(
        url,
        request.method,
        user
    );
}

export async function patchUser(user : Partial<User>) {
    let request = await findRouter("patchUser");
    let url : string = `${request.router}${user.idUsuario}`

    return selectMethod(
        url,
        request.method,
        user
    );
}

export async function deleteUser(id : number) {
    let request = await findRouter("deleteUser");
    let url : string = `${request.router}${id}`

    return selectMethod(
        url,
        request.method,
    );
}