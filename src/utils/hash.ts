import { hashSync, compareSync } from 'bcrypt';

export const hash = (plainText: string) => hashSync(plainText, 10);
export const compare = (plainText: string, hashed: string) => compareSync(plainText, hashed);
