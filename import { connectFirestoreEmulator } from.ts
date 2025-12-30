import { connectFirestoreEmulator } from 'firebase/firestore';
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  connectFirestoreEmulator(firestore, 'localhost', 8080);
}