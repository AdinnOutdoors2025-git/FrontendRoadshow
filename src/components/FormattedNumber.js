export const formatWithCommas = (number) => {
  if (number === null || number === undefined) return '0';
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Indian numbering system (10,00,000) - lakhs and crores
export const formatIndianNumber = (number) => {
  if (number === null || number === undefined) return '0';
  
  const num = Number(number);
  if (isNaN(num)) return '0';
  
  const str = num.toString();
  const lastThree = str.slice(-3);
  const otherNumbers = str.slice(0, -3);
  
  if (otherNumbers !== '') {
    const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    return `${formattedOther},${lastThree}`;
  }
  
  return lastThree;
};

// Auto-detect and format based on number size
export const formatNumber = (number, useIndianSystem = false) => {
  if (number === null || number === undefined) return '0';
  
  const num = Number(number);
  if (isNaN(num)) return '0';
  
  // For very large numbers, use Indian system if specified
  if (useIndianSystem || num >= 100000) {
    return formatIndianNumber(num);
  }
  
  // For smaller numbers, use standard commas
  return formatWithCommas(num);
};

// Format with abbreviation (K, M, B)
export const formatNumberAbbreviated = (number) => {
  if (number === null || number === undefined) return '0';
  
  const num = Number(number);
  if (isNaN(num)) return '0';
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  return num.toString();
};

// Format with suffix (for counts like "1.2K available")
export const formatCount = (number, label = '') => {
  const formatted = formatNumberAbbreviated(number);
  return label ? `${formatted} ${label}` : formatted;
};

// Format currency (if needed)
export const formatCurrency = (amount, currency = '₹') => {
  if (amount === null || amount === undefined) return `${currency}0`;
  
  const formatted = formatIndianNumber(amount);
  return `${currency}${formatted}`;
};