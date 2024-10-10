export const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
};

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const encodeGpa = (gpa: number | string) => {
  const gpaInNumber = typeof gpa === "string" ? parseFloat(gpa) : gpa;
  return BigInt(gpaInNumber * 100);
};

export const decodeGpa = (gpa: bigint) => {
  return Number(gpa) / 100;
};
