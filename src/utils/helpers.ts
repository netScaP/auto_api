export const maskPhone = (phone: string): string => {
  const toMaskPhone: string = phone
    .toString()
    .split('')
    .filter((e: string | number) => !isNaN(e as number) && e !== ' ')
    .join('');

  return toMaskPhone;
};

export function generatePassword(): string {
  return '1234';
  // return Math.floor(1000 + Math.random() * 9000).toString();
}
