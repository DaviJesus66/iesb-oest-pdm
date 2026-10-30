const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

/** Faz uma requisição JSON e trata erros HTTP. */
async function request(path, options = {}) {
  if (!BASE_URL) {
    throw new Error('EXPO_PUBLIC_API_URL não está definida no .env.');
  }

  const response = await fetch(`${BASE_URL}/${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  // fetch não lança erro em 404/500: precisamos verificar.
  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}`);
  }
  return response.json();
}

const send = (method, body) => ({ method, body: JSON.stringify(body) });

export const api = {
  list: (resource) => request(resource),
  create: (resource, body) => request(resource, send('POST', body)),
  update: (resource, id, body) => request(`${resource}/${id}`, send('PUT', body)),
  remove: (resource, id) => request(`${resource}/${id}`, { method: 'DELETE' }),
};
