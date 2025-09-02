
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
import { useSession } from "../ctx";

export default function ListFooterComponent() {
    const router = useRouter();
    const { signOut } = useSession()
    return (
        <View>
            <Text>Footer text</Text>
            <Button onPress={() => {
                        signOut()
                        // router.navigate("/sign-in")
                    }
                } title="Log out" />
        </View>
    )
}