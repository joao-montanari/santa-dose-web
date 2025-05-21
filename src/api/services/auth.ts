import { selectMethod } from '@Api/methods';
import { findRouter }  from '@Api/mapRouters';
import { Auth } from '@Models/user';

export async function LoginRequest(user : Auth) {
    const request = await findRouter("login");

    return selectMethod(
        request.router,
        request.method,
        user
    );
}