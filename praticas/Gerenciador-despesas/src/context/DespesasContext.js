import { createContext, useContext, useState } from 'react';
import { DESPESAS_EXEMPLO } from '../data/despesas';

const DespesasContext = createContext();

export function DespesasProvider({ children }) {
  const [despesas, setDespesas] = useState(DESPESAS_EXEMPLO);

  function adicionarDespesa(nova) {
    setDespesas((atual) => [nova, ...atual].sort((a, b) => b.data - a.data));
  }

  return (
    <DespesasContext.Provider value={{ despesas, adicionarDespesa }}>
      {children}
    </DespesasContext.Provider>
  );
}

export function useDespesas() {
  return useContext(DespesasContext);
}
