type SOURCE = 'schemas' | 'realms';

async function fetchMetea(source: SOURCE, take: number = 100, skip: number = 0) {
  try {
    return fetch(`http://localhost:3001/api/v1/metae/${source}?take=${take}&skip=${skip}&verbose=true`);
  } catch (error) {
    console.log(error);
  }
}

export const useApiDCCS = () => ({
  fetchMetea,
});
