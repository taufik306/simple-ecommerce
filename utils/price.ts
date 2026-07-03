export interface PricingFormat {
  symbolPosition?: 'before' | 'after';
  addSpace?: boolean;
  thousandSeparator?: string;
  decimalSeparator?: string;
  decimalPlaces?: number;
}

export function formatPrice(
  price: number,
  currencySymbol: string = '$',
  formatSettings?: PricingFormat
): string {
  const position = formatSettings?.symbolPosition || 'before';
  const addSpace = formatSettings?.addSpace || false;
  const thousandSep = formatSettings?.thousandSeparator || ',';
  const decimalSep = formatSettings?.decimalSeparator || '.';
  const decimalPlaces = formatSettings?.decimalPlaces ?? 2;

  // Format the number part
  const fixedPrice = price.toFixed(decimalPlaces);
  
  // Split into integer and decimal parts
  const parts = fixedPrice.split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? parts[1] : '';

  // Add thousand separators
  const integerWithThousandSep = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSep);

  // Combine with decimal separator
  const numberStr = decimalPlaces > 0 && decimalPart 
    ? `${integerWithThousandSep}${decimalSep}${decimalPart}`
    : integerWithThousandSep;

  // Apply symbol position and spacing
  const spaceStr = addSpace ? ' ' : '';
  
  if (position === 'after') {
    return `${numberStr}${spaceStr}${currencySymbol}`;
  }
  
  return `${currencySymbol}${spaceStr}${numberStr}`;
}
