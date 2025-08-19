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


export default function App() {

    return (
        <SafeAreaView style={ styles.container }>
            <InitialPageComponent />
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