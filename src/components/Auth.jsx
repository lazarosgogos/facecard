import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, Button, TextInput, } from 'react-native'
import { supabase } from '../../lib/supabase'
import { makeRedirectUri } from "expo-auth-session";
import { useSession } from './ctx';
import { WebBrowser} from "expo-web-browser"
import { Linking } from 'expo-linking';
import { Redirect, useLocalSearchParams } from 'expo-router';


// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

// WebBrowser.maybeCompleteAuthSession(); // required for web only
export default function Auth() {
    const [email, setEmail] = useState('lazos.go@gmail.com');
    const [loading, setLoading] = useState(false)
    
    const redirectTo = makeRedirectUri({path: 'sign-in'});
    

    const { token_hash } = useLocalSearchParams();
    console.log('Token Hash: ', token_hash)
    if (token_hash){
        const { data, error } = supabase.auth.verifyOtp({
            token_hash: token_hash,
            type: 'email',
        })
        if (data) {
            console.log('data:',data)
            // return <Redirect href="/index" />;
        } else if (error){
            Alert.alert('Error!',error)
        }
    }

    const { signIn } = useSession();
    async function handleSignIn() {
        setLoading(true);
        try {
            Alert.alert('Check your mail for the login link!');
            signIn(email, redirectTo);
            
        } catch(error) {
            Alert.alert(error.message)
        } finally{
            setLoading(false);
        }
    }
    
    return (
        <View style={styles.container}>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <TextInput
                    style={styles.textInput}
                    label="Email"
                    leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="email@address.com"
                    placeholderTextColor={"gray"}
                    autoCapitalize={'none'}
                    autoFocus={true}
                />
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button title="Sign in" disabled={loading} onPress={() => handleSignIn()} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
    textInput: { width: 'auto', minHeight: 50, height: "auto", padding: 15, 
        borderWidth: 1, borderRadius: 5}
})