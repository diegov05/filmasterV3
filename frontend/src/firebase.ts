import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { config } from './config/config';
import { getFirestore } from 'firebase/firestore'

const app = initializeApp(config.firebaseConfig);
const auth = getAuth(app);

const db = getFirestore()

export { auth, db };