
export type Router = {
    router : string,
    name : string,
    method : string
}

const backEndRouters : Router[] = [
    {
        router: "/login",
        name: "login",
        method: "POST_FORM_ENCODED"
    },

    {
        router: "/produtos/produto_name/",
        name: "getProductName",
        method: "GET"
    },

    {
        router: "/produtos/produto_id/",
        name: "getProduct",
        method: "GET"
    },
    {
        router: "/produtos",
        name: "listProduct",
        method: "GET"
    },
    {
        router: "/produtos/adicionar",
        name: "postProduct",
        method: "POST"
    },
    {
        router: "/produtos/atualizar_by_id/",
        name: "updateProduct",
        method: "PUT"
    },
    {
        router: "/produtos/delete_by_id/",
        name: "deleteProduct",
        method: "DELETE"
    },
    {
        router: "/usuarios",
        name: "listUsers",
        method: "GET",
    },
    {
        router: "/usuarios/get_by_id/",
        name: "getUser",
        method: "GET",
    },
    {
        router: "/usuarios/adicionar",
        name: "createUser",
        method: "POST",
    },
    {
        router: "/usuarios/atualizar_by_id/",
        name: "putUser",
        method: "PUT",
    },
    {
        router: "/usuarios/atualizar_by_id/",
        name: "patchUser",
        method: "PATCH",
    },
    {
        router: "/users/delete_by_id/",
        name: "deleteUser",
        method: "DELETE",
    },
    {
        router: "/meses_venda/adicionar_valores",
        name: "addMonthValues",
        method: "POST"
    },
    {
        router: "/meses_valor/adicionar_valores_dias",
        name: "addDayMonthValues",
        method: "POST"
    },
    {
        router: "/meses_venda/atualizar_valores/",
        name: "updateMonthValues",
        method: "PUT"
    },
    {
        router: "/meses_venda/deletar_valores/",
        name: "deleteMonthValues",
        method: "DELETE"
    },
    {
        router: "/meses_venda",
        name: "getMonthValues",
        method: "GET"
    },
    {
        router: "/dias_venda/",
        name: "getDaysMonthValues",
        method: "GET"
    },
    {
        router: "/fiados/adicionar_valores",
        name: "addSpunValues",
        method: "POST"
    },
    {
        router: "/fiados",
        name: "getSpunValues",
        method: "GET"
    },
    
    {
        router: "/fiados/atualizar_valores",
        name: "updateSpunValues",
        method: "PUT"
    },

]

export async function findRouter(router : string) {
    const resultSearch = {...[...backEndRouters].find(r => r.name === router)};

    return resultSearch;
}