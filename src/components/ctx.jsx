import { useContext, createContext, useEffect } from 'react';
import { useStorageState } from './useStorageState'
import { supabase } from '../../lib/supabase';
import { Alert } from 'react-native';

const AuthContext = createContext({
    signIn: () => null,
    signOut: () => null,
    session: null,
    isLoading: false,
})

// Hook to access session
export function useSession() {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error('useSession must be wrapped in a <SessionProvider />')
    }
    return value
}

export function SessionProvider({ children }){
    const [[isLoading, session], setSession] = useStorageState('session');

    useEffect(() => {
        const { data: subscription } = supabase.auth.onAuthStateChange(
            (e, session) => {
                if (session) {
                    setSession(session.access_token);
                } else {
                    setSession(null)
                }
            }
        );
        
        
        return () => {
            subscription?.unsubscribe();
        }
    }, [setSession])
    
    return (
        <AuthContext.Provider 
            value={{
                signIn: async (email, redirectTo) => {
                    // Perform sign-in logic here
                    const { error } = await supabase.auth.signInWithOtp({
                                email: email,
                                options: {
                                    emailRedirectTo: redirectTo,
                                },
                            })
                    if (error) Alert.alert(error.message)
                    // supabase.auth.onAuthStateChange() 
                    
                },
                signOut: async () => {
                    await supabase.auth.signOut();
                    setSession(null);
                },
                session,
                isLoading,
            }}
            >
                {children}
            </AuthContext.Provider>
    )
}