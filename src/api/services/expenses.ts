import { selectMethod } from '@Api/methods';
import { findRouter }  from '@Api/mapRouters';
import { monthsExpenses } from '@Models/monthsExpenses';
import { DayBillsExpenses } from '@Models/daysValueExpenses';

export async function createMonthExpensesValue(monthExpensesValue : monthsExpenses){
    let request = await findRouter("addExpensesValues");

    return selectMethod(
        request.router,
        request.method,
        monthExpensesValue
    )
}
export async function addDaysExpensesValue(dayValueExpenses : DayBillsExpenses){
    let request = await findRouter("addDayExpensesValues")

    return selectMethod(
        request.router,
        request.method,
        dayValueExpenses
    )
}

export async function getExpensesMonthValue(){
    let request = await findRouter("getExpensesValues");

    return selectMethod(
        request.router,
        request.method,
    )
}

export async function getDaysExpensesValue(mes: string){
    let request = await findRouter("getDaysExpensesValues");
    let url: string = `${request.router}${mes}`

    return selectMethod(
        url,
        request.method,
    )
}

export async function deleteMonthExpensesValue(monthExpenses : string) {
    let request = await findRouter("deleteMonthExpensesValues");
    let url : string = `${request.router}${monthExpenses}`

    return selectMethod(
        url,
        request.method,
    );
}
