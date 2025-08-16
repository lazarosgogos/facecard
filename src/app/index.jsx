import { useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import InitialPageComponent from "../components/initial-page/InitialPageComponent";
import { Button } from "react-native";
import { useRouter } from "expo-router";

export default function App() {
    const router = useRouter();
    return (
        <SafeAreaView style={ styles.container }>
            <InitialPageComponent />
            <Button onPress={() => router.navigate("/selected_image/")} title="Go to selected event"/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            padding: 16,
            alignItems: 'center',
            backgroundColor: '#ddd',
        }
    }
)