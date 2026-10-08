// Gera datas relativas a hoje, para que "Despesas Recentes" sempre tenha dados.
function diasAtras(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export const DESPESAS_EXEMPLO = [
  { id: 'd1', descricao: 'Supermercado', valor: 89.9, data: diasAtras(1), categoria: 'Alimentação' },
  { id: 'd2', descricao: 'Uber para o trabalho', valor: 24.5, data: diasAtras(2), categoria: 'Transporte' },
  { id: 'd3', descricao: 'Cinema', valor: 45.0, data: diasAtras(4), categoria: 'Lazer' },
  { id: 'd4', descricao: 'Conta de luz', valor: 132.75, data: diasAtras(6), categoria: 'Contas' },
  { id: 'd5', descricao: 'Restaurante', valor: 62.3, data: diasAtras(15), categoria: 'Alimentação' },
  { id: 'd6', descricao: 'Gasolina', valor: 150.0, data: diasAtras(20), categoria: 'Transporte' },
  // Despesa futura: NÃO deve aparecer em "Despesas Recentes"
  { id: 'd7', descricao: 'Show (ingresso antecipado)', valor: 180.0, data: diasAtras(-5), categoria: 'Lazer' },
];
