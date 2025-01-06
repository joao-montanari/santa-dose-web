import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { Product } from '@Models/product';
import { User } from '@Models/user';

const type : string = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const extension : string = ".xlsx";

export const exportExcelProduct = (data : Product[], name : string) => {
    const saveData: any[] = [];

    data.forEach((element) => {
        const saveElement = {
            "Nome" : element.nome,
            "Tipo" : element.tipo,
            "Valor" : `R$ ${element.valor_venda}`,
            "Quantidade" : element.quantidade,
            "Tamanho" : element.tamanho,
            "Data de validade" : element.data_validade,
            "Data de cadastro" : element.data_cadastro
        }
        saveData.push(saveElement);
    });

    const ws = XLSX.utils.json_to_sheet(saveData);
    const wb = { 
        Sheets: { "Produtos" : ws },
        SheetNames: ["Produtos"]
    };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: type });
    FileSaver.saveAs(dataBlob, name + extension);
}

export const exportExcelUser = (data : User[], name : string) => {
    const saveData: any[] = [];

    data.forEach((element) => {
        const saveElement = {
            "Nome de usuário" : element.username,
            "E-mail" : element.email,
            "Administrador" : element.is_admin ? "sim" : "não"
        }
        saveData.push(saveElement);
    });

    const ws = XLSX.utils.json_to_sheet(saveData);
    const wb = { 
        Sheets: { "Usuarios" : ws },
        SheetNames: ["Usuarios"]
    };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: type });
    FileSaver.saveAs(dataBlob, name + extension);
}