const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://superheroes-production-17af.up.railway.app/api';

let baseUrlLogged = false;

export async function fetchJSON<T>(path: string, options?: RequestInit): Promise<T> {
  if (!baseUrlLogged && import.meta.env.DEV) {
    console.log('[API] BASE_URL =', BASE_URL);
    baseUrlLogged = true;
  }
  let response: Response;
  try {
    response = await fetch(BASE_URL + path, {
      headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
      ...options,
    });
  } catch (networkErr) {
    throw new Error(
      'NETWORK_ERROR: ' + (networkErr instanceof Error ? networkErr.message : String(networkErr))
    );
  }
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`HTTP_${response.status}: ${text || response.statusText}`);
  }
  try {
    return (await response.json()) as T;
  } catch (parseErr) {
    throw new Error(
      'PARSE_ERROR: ' + (parseErr instanceof Error ? parseErr.message : String(parseErr))
    );
  }
}

export { BASE_URL };
