import { useState } from 'react';
import { BondForm } from './components/BondForm/BondForm';
import { ResultsSummary } from './components/ResultsSummary/ResultsSummary';
import { CashFlowTable } from './components/CashFlowTable/CashFlowTable';
import { calculateBond } from './api/bondsApi';
import type { CalculateBondRequest, CalculateBondResponse } from './types/bond.types';

type AppState = 'idle' | 'loading' | 'success' | 'error';

export default function App() {
  const [state, setState] = useState<AppState>('idle');
  const [result, setResult] = useState<CalculateBondResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  async function handleCalculate(input: CalculateBondRequest) {
    setState('loading');
    setErrorMessage('');

    try {
      const data = await calculateBond(input);
      setResult(data);
      setState('success');
    } catch {
      setState('error');
      setErrorMessage('Something went wrong. Please check your inputs and try again.');
    }
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-base-content">Bond Yield Calculator</h1>
          <p className="mt-2 text-base-content/60">
            Enter bond details to calculate yield metrics and view the full cash flow schedule.
          </p>
        </header>

        {/* Section A — Input Form */}
        <div className="card bg-base-200 shadow-sm mb-8">
          <div className="card-body">
            <BondForm onSubmit={handleCalculate} isLoading={state === 'loading'} />
          </div>
        </div>

        {/* Error banner */}
        {state === 'error' && (
          <div role="alert" className="alert alert-error mb-6">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Section B — Results Summary */}
        {state === 'success' && result && (
          <>
            <ResultsSummary result={result} />
            {/* Section C — Cash Flow Schedule */}
            <CashFlowTable schedule={result.cashFlowSchedule} />
          </>
        )}
      </div>
    </div>
  );
}
