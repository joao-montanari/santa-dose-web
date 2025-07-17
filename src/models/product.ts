export type Product = {
  idProduto: number | null,
  tipo: string,
  nome: string,
  tamanho: string,
  data_cadastro?: string | null,
  quantidade: number,
  quantidadeUn: number,
  valor_compra: number,
  valor_venda?: number,
  percentual_lucro?: number,
  data_validade: string,
}