export const formatNaira = (amount: number, withDecimals = false) => {
  if (withDecimals) {
    return `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `₦${amount.toLocaleString("en-NG")}`;
};

export const parseAmountInput = (value: string) => {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
};
