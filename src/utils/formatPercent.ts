export default function formatPercent(percent : number | undefined | null) {
    if (percent === undefined || percent === null){
        return "0%";
    }

    const strPercent: string = percent.toString();

    if(strPercent.includes('.')){
        const splitPercent: string[] = strPercent.split('.');
        return `${splitPercent[0]},${splitPercent[1].padEnd(2, "0")}%`;
    }

    
    return `${percent}%`;
}