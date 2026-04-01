// Format a number as Kenyan Shillings
export const formatKES = (amount) => {
  if (amount === null || amount === undefined) return 'KES 0.00';
  const num = parseFloat(amount);
  return `KES ${num.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Format a number as KES (short, no decimals for large amounts)
export const formatKESShort = (amount) => {
  const num = parseFloat(amount) || 0;
  if (num >= 1000000) return `KES ${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `KES ${(num / 1000).toFixed(1)}K`;
  return `KES ${num.toFixed(0)}`;
};

// Format ISO date string to human-readable
export const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Format ISO date to time
export const formatTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
};

// Relative date (e.g. "2 days ago")
export const formatRelativeDate = (isoString) => {
  if (!isoString) return 'Never';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

// Get initials from a name (e.g. "John Wambua" → "JW")
export const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Format phone number to display format
export const formatPhone = (phone) => {
  if (!phone) return '';
  // Normalise to +254 format
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '254' + cleaned.slice(1);
  }
  if (cleaned.startsWith('254') && cleaned.length === 12) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
};

// Validate phone (Kenyan format)
export const isValidPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 9 && cleaned.length <= 13;
};
