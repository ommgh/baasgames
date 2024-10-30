import { atom } from "recoil";

// Atom to store a list of lists of strings
export const balance = atom<number>({
  key: "balance",
  default: 0,
});
