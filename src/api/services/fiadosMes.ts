import { selectMethod } from '@Api/methods';
import { findRouter }  from '@Api/mapRouters';
import { MonthElements } from '@Models/monthsValue';
import { SpunValue } from '@Models/spunValue';

export async function createMonthValue(monthValue : MonthElements){
    let request = await findRouter("addMonthValues");

    return selectMethod(
        request.router,
        request.method,
        monthValue
    )
}

export async function getMonthValue(){
    let request = await findRouter("getMonthValues");

    return selectMethod(
        request.router,
        request.method,
    )
}

export async function createSpunValue(spunValue : SpunValue){
    let request = await findRouter("addSpunValues");

    return selectMethod(
        request.router,
        request.method,
        spunValue
    )
}

export async function getSpunValue(){
    let request = await findRouter("getSpunValues");

    return selectMethod(
        request.router,
        request.method,
    )
}

export async function updateSpunValue(spunValue : SpunValue) {
    let request = await findRouter("updateSpunValues");
    let url : string = `${request.router}`

    return selectMethod(
        url,
        request.method,
        spunValue
    );
}
