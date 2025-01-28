import { findRouter } from "@Api/mapRouters";
import { selectMethod } from "@Api/methods";
import { daysValueExpensesCard } from "@Models/daysValueExpensesCard";
import { monthsExpensesCard } from "@Models/monthsExpensesCard";

export async function createCardMonthExpensesValue(monthExpensesCardValue : monthsExpensesCard){
    let request = await findRouter("addCardExpensesValues");

    return selectMethod(
        request.router,
        request.method,
        monthExpensesCardValue
    )
}
export async function addCardDaysExpensesValue(dayValueExpenseCard : daysValueExpensesCard){
    let request = await findRouter("addDayCardExpensesValues")

    return selectMethod(
        request.router,
        request.method,
        dayValueExpenseCard
    )
}

export async function getCardExpensesMonthValue(){
    let request = await findRouter("getCardExpensesValues");

    return selectMethod(
        request.router,
        request.method,
    )
}

export async function getCardDaysExpensesValue(mes: string){
    let request = await findRouter("getCardDaysExpensesValues");
    let url: string = `${request.router}${mes}`

    return selectMethod(
        url,
        request.method,
    )
}

export async function deletCardMonthExpensesValue(monthExpenses : string) {
    let request = await findRouter("deleteMonthCardExpensesValues");
    let url : string = `${request.router}${monthExpenses}`

    return selectMethod(
        url,
        request.method,
    );
}