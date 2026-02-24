import type { CalculateBondResponse, PriceIndicator } from '../../types/bond.types';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { MetricCard } from './MetricCard';

interface ResultsSummaryProps {
  result: CalculateBondResponse;
}

function priceIndicatorLabel(indicator: PriceIndicator): string {
  if (indicator === 'premium') return 'Trading at a Premium 🟢';
  if (indicator === 'discount') return 'Trading at a Discount 🔴';
  return 'Trading at Par ⚪';
}

function priceIndicatorAccent(indicator: PriceIndicator): 'green' | 'red' | 'neutral' {
  if (indicator === 'premium') return 'green';
  if (indicator === 'discount') return 'red';
  return 'neutral';
}

export function ResultsSummary({ result }: ResultsSummaryProps) {
  return (
    <section aria-label="Calculation results">
      <h2 className="text-xl font-semibold mb-4">Results</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard
          label="Current Yield"
          value={formatPercent(result.currentYield)}
          description="Annual coupon as a percentage of market price"
        />
        <MetricCard
          label="Yield to Maturity (YTM)"
          value={formatPercent(result.ytm)}
          description="Annualised return if held to maturity"
        />
        <MetricCard
          label="Total Interest Earned"
          value={formatCurrency(result.totalInterestEarned)}
          description="Sum of all coupon payments over the bond's life"
        />
        <MetricCard
          label="Price Indicator"
          value={priceIndicatorLabel(result.priceIndicator)}
          description="Bond is priced below / above / at face value"
          accent={priceIndicatorAccent(result.priceIndicator)}
        />
      </div>
    </section>
  );
}
