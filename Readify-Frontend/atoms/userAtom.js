import { atom } from 'recoil';

export const userAtom = atom({
  key: 'userAtom', // unique ID for this atom
  default: {
    email: '',
    token: '',
    userId: '', // Store the userId here
  },
});

