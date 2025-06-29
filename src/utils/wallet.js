// import { Keypair } from '@solana/web3.js';
// import { Buffer } from 'buffer';

// const ENCRYPTION_KEY = 'aJM5Fnv2n2HuVxOsNI-oFGxfZwfdXDR8Eg2RIl87Nvo=';

// export function encrypt(text) {
//   return Array.from(text).map((char, i) =>
//     String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length))
//   ).join('');
// }

// export function decrypt(cipher) {
//   return Array.from(cipher).map((char, i) =>
//     String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length))
//   ).join('');
// }

// export const getOrCreateWallet = () => {
//   try {
//     const privateKeyEncoded = localStorage.getItem('solana_bot_pk_encrypted');
//     if (privateKeyEncoded) {
//       const decrypted = decrypt(privateKeyEncoded);
//       const keyBytes = new Uint8Array(JSON.parse(decrypted));
//       const keypair = Keypair.fromSecretKey(keyBytes);
//       console.log("Existing wallet loaded:", keypair.publicKey.toBase58());
//       return keypair;
//     }
//   } catch (e) {
//     console.error("Error loading wallet:", e);
//     localStorage.removeItem('solana_bot_pk_encrypted');
//   }

//   // Fallback: generate new
//   const keypair = Keypair.generate();
//   const privateKeyBytes = keypair.secretKey;
//   localStorage.setItem('solana_bot_pk_encrypted', encrypt(JSON.stringify(Array.from(privateKeyBytes))));
//   console.log("New wallet generated:", keypair.publicKey.toBase58());
//   return keypair;
// };



















// src/utils/wallet.js
import { Keypair } from '@solana/web3.js';
// Removed: Buffer import (assuming global polyfill in main.jsx/vite.config.js)

// --- NO CUSTOM ENCRYPTION IN UTILS/WALLET.JS ANYMORE FOR STORAGE ---
// The private key will be stored as a Base64-encoded JSON string of Uint8Array directly
// in localStorage. This is NOT encryption, just encoding.
// Real encryption for *sending to backend* happens in App.jsx.

export const getOrCreateWallet = () => {
  let privateKeyStored = localStorage.getItem('solana_bot_pk_base64'); // New storage key
  let keypair;

  if (privateKeyStored) {
    try {
      // Decode Base64, then parse JSON string back to array of numbers, then to Uint8Array
      const privateKeyBytes = new Uint8Array(JSON.parse(atob(privateKeyStored)));
      keypair = Keypair.fromSecretKey(privateKeyBytes);
      console.log("Existing wallet loaded:", keypair.publicKey.toBase58());
    } catch (e) {
      console.error("Error loading existing wallet, generating new:", e);
      localStorage.removeItem('solana_bot_pk_base64'); // Clear invalid data
      keypair = Keypair.generate();
      const privateKeyBytes = keypair.secretKey;
      localStorage.setItem('solana_bot_pk_base64', btoa(JSON.stringify(Array.from(privateKeyBytes))));
      console.log("New wallet generated (error during load):", keypair.publicKey.toBase58());
    }
  } else {
    keypair = Keypair.generate();
    const privateKeyBytes = keypair.secretKey; // Uint8Array
    // Store as Base64-encoded JSON string of the byte array
    localStorage.setItem('solana_bot_pk_base64', btoa(JSON.stringify(Array.from(privateKeyBytes))));
    console.log("New wallet generated:", keypair.publicKey.toBase58());
  }

  return keypair;
};

// No `encrypt` or `decrypt` exports from here anymore, as they are not used for localStorage directly.
// The raw private key (Uint8Array) is what we'll get from `keypair.secretKey` and then base64 encode for backend.

