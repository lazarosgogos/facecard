
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
import { useRouter } from "expo-router";
import { Button } from "react-native";

export default function ListFooterComponent() {
    const router = useRouter();
    return (
        <View>
            <Text>Footer text</Text>
            {/* <Button onPress={() => router.navigate("/selected_event/")} title="Go to selected event" /> */}
        </View>
    )
}