'use client';

export default function useReceiptDetail() {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "0";
    return Number(price).toLocaleString('ko-KR');
  };

  return {
    formatDate,
    formatPrice,
  };
}