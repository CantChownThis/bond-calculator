import axios from 'axios';
import type { CalculateBondRequest, CalculateBondResponse } from '../types/bond.types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
});

/** POST /bonds/calculate — send bond parameters, receive all metrics and cash flow schedule */
export async function calculateBond(
  input: CalculateBondRequest,
): Promise<CalculateBondResponse> {
  const { data } = await api.post<CalculateBondResponse>('/bonds/calculate', input);
  return data;
}
