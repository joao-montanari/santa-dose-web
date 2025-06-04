
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
        method: "PATCH"
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
        method: "MULTIPART_POST",
    },
    {
        router: "/produtos/totalWtipo",
        name: "addTotalAndType",
        method: "POST",
    },
    {
        router: "/vendasCarrinho",
        name: "addSalesAndType",
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
        method: "PATCH"
    },
    {
        router: "/meses_valor/adicionar_valores_dias",
        name: "addDayMonthValues",
        method: "PATCH"
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
        router: "/vendasCarrinho",
        name: "getSalesAndType",
        method: "GET"
    },
    {
        router: "/produtos/totalWtipos",
        name: "getTotalAndType",
        method: "GET"
    },
    {
        router: "/fiados/adicionar_valores",
        name: "addSpunValues",
        method: "PATCH"
    },
    {
        router: "/fiados",
        name: "getSpunValues",
        method: "GET"
    },
    {
        router: "/boletos/adicionar_valores",
        name: "addBillsValues",
        method: "PATCH"
    },
    {
        router: "/boletos/adicionar_valores_dias",
        name: "addDayBillsValues",
        method: "PATCH"
    },
    {
        router: "/boletos",
        name: "getBillsValues",
        method: "GET"
    },
    {
        router: "/dias_boletos/",
        name: "getDaysBillsValues",
        method: "GET"
    },
    {
        router: "/boletos/deletar_valores/",
        name: "deleteMonthBillsValues",
        method: "DELETE"
    },
    {
        router: "/gastos_aleatorios/adicionar_valores",
        name: "addExpensesValues",
        method: "PATCH"
    },
    {
        router: "/gastos_aleatorios/adicionar_valores_dias",
        name: "addDayExpensesValues",
        method: "PATCH"
    },
    {
        router: "/gastos_aleatorios",
        name: "getExpensesValues",
        method: "GET"
    },
    {
        router: "/gastos_aleatorios/",
        name: "getDaysExpensesValues",
        method: "GET"
    },
    {
        router: "/gastos_aleatorios/deletar_valores/",
        name: "deleteMonthExpensesValues",
        method: "DELETE"
    },
    {
        router: "/gastos_cartao/adicionar_valores",
        name: "addCardExpensesValues",
        method: "PATCH"
    },
    {
        router: "/gastos_cartao/adicionar_valores_dias",
        name: "addDayCardExpensesValues",
        method: "PATCH"
    },
    {
        router: "/gastos_cartao",
        name: "getCardExpensesValues",
        method: "GET"
    },
    {
        router: "/gastos_cartao/",
        name: "getCardDaysExpensesValues",
        method: "GET"
    },
    {
        router: "/gastos_cartao/deletar_valores/",
        name: "deleteMonthCardExpensesValues",
        method: "DELETE"
    },

]

export async function findRouter(router : string) {
    const resultSearch = {...[...backEndRouters].find(r => r.name === router)};

    return resultSearch;
}