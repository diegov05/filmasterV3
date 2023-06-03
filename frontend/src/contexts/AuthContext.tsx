import React, { createContext, useEffect, useState } from 'react';

import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

// Create an authentication context
const AuthContext = createContext<User | null>(null);

// AuthProvider component
const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
