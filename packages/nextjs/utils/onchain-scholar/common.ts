export const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
};

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
