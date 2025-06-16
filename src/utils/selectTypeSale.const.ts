export type TypeSellSelect = {
    value: string | number,
    label: string,
}

export const sell_type_select : TypeSellSelect[] = [
    {
        value: 'Cartao',
        label: 'Cartão',
    },
    {
        value: 'Dinheiro',
        label: 'Dinheiro',
    },
    {
        value: 'Pix',
        label: 'Pix',
    },
]