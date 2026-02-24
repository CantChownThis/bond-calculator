import type { CashFlowEntry } from '../../types/bond.types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface CashFlowTableProps {
  schedule: CashFlowEntry[];
}

export function CashFlowTable({ schedule }: CashFlowTableProps) {
  if (schedule.length === 0) return null;

  const lastPeriod = schedule[schedule.length - 1].period;

  return (
    <section aria-label="Cash flow schedule" className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Cash Flow Schedule</h2>
      <div className="overflow-x-auto rounded-lg border border-base-300">
        <table className="table table-zebra w-full text-sm">
          <thead>
            <tr>
              <th>Period</th>
              <th>Payment Date</th>
              <th>Coupon Payment</th>
              <th>Cumulative Interest</th>
              <th>Remaining Principal</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row) => {
              const isFinal = row.period === lastPeriod;
              return (
                <tr key={row.period} className={isFinal ? 'font-bold bg-base-300' : ''}>
                  <td>{row.period}</td>
                  <td>{formatDate(row.paymentDate)}</td>
                  <td>{formatCurrency(row.couponPayment)}</td>
                  <td>{formatCurrency(row.cumulativeInterest)}</td>
                  <td>
                    {formatCurrency(row.remainingPrincipal)}
                    {isFinal && (
                      <span className="ml-2 badge badge-sm badge-neutral">+ Principal</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
