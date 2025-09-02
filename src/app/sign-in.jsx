import { Text, SafeAreaView, StyleSheet } from "react-native";
import Auth from "../components/Auth";


export default function SignIn() {
    return <SafeAreaView style={styles.container}>
        <Text style={styles.headerText}>Sign in page</Text>
        <Auth/>
    </SafeAreaView>
}

const styles = StyleSheet.create({
    container: {flex:1, padding:15, alignItems:'center'},
    headerText: {padding: 15, fontSize:22, fontWeight:700, margin: 15}
})