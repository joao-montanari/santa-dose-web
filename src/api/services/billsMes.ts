import { selectMethod } from '@Api/methods';
import { findRouter }  from '@Api/mapRouters';
import { BillsMonthElements } from '@Models/monthsBills';
import { DayBillsElements } from '@Models/daysValuesBills';

export async function createMonthBillsValue(monthValueBills : BillsMonthElements){
    let request = await findRouter("addBillsValues");

    return selectMethod(
        request.router,
        request.method,
        monthValueBills
    )
}
export async function addDaysBillsValue(dayValueBills : DayBillsElements){
    let request = await findRouter("addDayBillsValues")

    return selectMethod(
        request.router,
        request.method,
        dayValueBills
    )
}

export async function getBillsMonthValue(){
    let request = await findRouter("getBillsValues");

    return selectMethod(
        request.router,
        request.method,
    )
}

export async function getDaysBillsValue(mes: string){
    let request = await findRouter("getDaysBillsValues");
    let url: string = `${request.router}${mes}`

    return selectMethod(
        url,
        request.method,
    )
}

export async function deleteMonthBillsValue(monthBills : string) {
    let request = await findRouter("deleteMonthBillsValues");
    let url : string = `${request.router}${monthBills}`

    return selectMethod(
        url,
        request.method,
    );
}
