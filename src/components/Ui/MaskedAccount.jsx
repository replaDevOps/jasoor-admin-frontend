
const MaskedAccount = ({ iban, className }) => {
  const maskIban = (iban) => {
    if (!iban) return '';
    
    // Keep first 4 and last 2 characters visible
    const prefix = iban.slice(0, 4);
    const suffix = iban.slice(-2);
    
    // Mask the middle characters
    const maskedSection = iban.slice(4, -2).replace(/\w/g, '*');

    // Group the IBAN for spacing: 4 characters per group
    const grouped = (prefix + maskedSection + suffix).match(/.{1,4}/g);

    return grouped.join(' ');
  };

  return (
    <div className={className}>
      {maskIban(iban)}
    </div>
  );
};

export {MaskedAccount};
