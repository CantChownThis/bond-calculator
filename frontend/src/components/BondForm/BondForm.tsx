import { useState } from 'react';
import type { CalculateBondRequest } from '../../types/bond.types';
import type { FormValues, FormErrors } from './BondForm.types';

interface BondFormProps {
  onSubmit: (values: CalculateBondRequest) => void;
  isLoading: boolean;
}

const INITIAL_VALUES: FormValues = {
  faceValue: '',
  couponRate: '',
  marketPrice: '',
  yearsToMaturity: '',
  couponFrequency: 'annual',
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  const faceValue = parseFloat(values.faceValue);
  if (!values.faceValue || isNaN(faceValue) || faceValue <= 0) {
    errors.faceValue = 'Face value must be greater than 0';
  }

  const couponRate = parseFloat(values.couponRate);
  if (values.couponRate === '' || isNaN(couponRate) || couponRate < 0 || couponRate > 100) {
    errors.couponRate = 'Coupon rate must be between 0 and 100';
  }

  const marketPrice = parseFloat(values.marketPrice);
  if (!values.marketPrice || isNaN(marketPrice) || marketPrice <= 0) {
    errors.marketPrice = 'Market price must be greater than 0';
  }

  const years = parseFloat(values.yearsToMaturity);
  if (!values.yearsToMaturity || isNaN(years) || years <= 0 || years % 0.5 !== 0) {
    errors.yearsToMaturity = 'Years to maturity must be a positive integer or half-integer (e.g. 0.5, 1, 1.5)';
  }

  return errors;
}

export function BondForm({ onSubmit, isLoading }: BondFormProps) {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Re-validate the changed field if it has been touched
    if (touched[name as keyof FormValues]) {
      const updated = { ...values, [name]: value };
      const newErrors = validate(updated);
      setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormErrors] }));
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(values);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormErrors] }));
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      Object.keys(values).map((k) => [k, true]),
    ) as Record<keyof FormValues, boolean>;
    setTouched(allTouched);

    const newErrors = validate(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit({
      faceValue: parseFloat(values.faceValue),
      couponRate: parseFloat(values.couponRate),
      marketPrice: parseFloat(values.marketPrice),
      yearsToMaturity: parseFloat(values.yearsToMaturity),
      couponFrequency: values.couponFrequency,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Face Value */}
      <div className="form-control mb-4">
        <label className="label" htmlFor="faceValue">
          <span className="label-text font-medium">Face Value ($)</span>
        </label>
        <input
          id="faceValue"
          name="faceValue"
          type="number"
          placeholder="e.g. 1000"
          className={`input input-bordered w-full ${errors.faceValue && touched.faceValue ? 'input-error' : ''}`}
          value={values.faceValue}
          onChange={handleChange}
          onBlur={handleBlur}
          min="0.01"
          step="any"
        />
        <label className="label">
          {errors.faceValue && touched.faceValue ? (
            <span className="label-text-alt text-error">{errors.faceValue}</span>
          ) : (
            <span className="label-text-alt text-base-content/60">The principal amount repaid at maturity</span>
          )}
        </label>
      </div>

      {/* Annual Coupon Rate */}
      <div className="form-control mb-4">
        <label className="label" htmlFor="couponRate">
          <span className="label-text font-medium">Annual Coupon Rate (%)</span>
        </label>
        <input
          id="couponRate"
          name="couponRate"
          type="number"
          placeholder="e.g. 5"
          className={`input input-bordered w-full ${errors.couponRate && touched.couponRate ? 'input-error' : ''}`}
          value={values.couponRate}
          onChange={handleChange}
          onBlur={handleBlur}
          min="0"
          max="100"
          step="any"
        />
        <label className="label">
          {errors.couponRate && touched.couponRate ? (
            <span className="label-text-alt text-error">{errors.couponRate}</span>
          ) : (
            <span className="label-text-alt text-base-content/60">Annual interest rate as a percentage of face value</span>
          )}
        </label>
      </div>

      {/* Market Price */}
      <div className="form-control mb-4">
        <label className="label" htmlFor="marketPrice">
          <span className="label-text font-medium">Market Price ($)</span>
        </label>
        <input
          id="marketPrice"
          name="marketPrice"
          type="number"
          placeholder="e.g. 950"
          className={`input input-bordered w-full ${errors.marketPrice && touched.marketPrice ? 'input-error' : ''}`}
          value={values.marketPrice}
          onChange={handleChange}
          onBlur={handleBlur}
          min="0.01"
          step="any"
        />
        <label className="label">
          {errors.marketPrice && touched.marketPrice ? (
            <span className="label-text-alt text-error">{errors.marketPrice}</span>
          ) : (
            <span className="label-text-alt text-base-content/60">The current price you would pay for the bond</span>
          )}
        </label>
      </div>

      {/* Years to Maturity */}
      <div className="form-control mb-4">
        <label className="label" htmlFor="yearsToMaturity">
          <span className="label-text font-medium">Years to Maturity</span>
        </label>
        <input
          id="yearsToMaturity"
          name="yearsToMaturity"
          type="number"
          placeholder="e.g. 10"
          className={`input input-bordered w-full ${errors.yearsToMaturity && touched.yearsToMaturity ? 'input-error' : ''}`}
          value={values.yearsToMaturity}
          onChange={handleChange}
          onBlur={handleBlur}
          min="0.5"
          step="0.5"
        />
        <label className="label">
          {errors.yearsToMaturity && touched.yearsToMaturity ? (
            <span className="label-text-alt text-error">{errors.yearsToMaturity}</span>
          ) : (
            <span className="label-text-alt text-base-content/60">Number of years until the bond matures</span>
          )}
        </label>
      </div>

      {/* Coupon Frequency */}
      <div className="form-control mb-6">
        <label className="label" htmlFor="couponFrequency">
          <span className="label-text font-medium">Coupon Frequency</span>
        </label>
        <select
          id="couponFrequency"
          name="couponFrequency"
          className="select select-bordered w-full"
          value={values.couponFrequency}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="annual">Annual</option>
          <option value="semi-annual">Semi-Annual</option>
        </select>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? <span className="loading loading-spinner loading-sm" /> : null}
        Calculate
      </button>
    </form>
  );
}
