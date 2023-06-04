import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { config } from './config/config';
const app = initializeApp(config.firebaseConfig);
const auth = getAuth(app);

export { auth };