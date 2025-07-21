export default function formatPercent(percent : number | undefined | null) {
    if (percent === undefined || percent === null){
        return "0%";
    }

    //Arredonda o número para uma casa decimal e o transforma em string
    const fixedPercent = percent.toFixed(1);

    const localizedPercent = fixedPercent.replace(".", ",");

    return `${localizedPercent}%`;

}