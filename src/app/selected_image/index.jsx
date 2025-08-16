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

export default function SelectedImage() {
    return <SafeAreaView>
        <Text>Selected Image page</Text>
    </SafeAreaView>
}