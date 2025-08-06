import React, { useState } from 'react';
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
import DatePickerComponent from './DatePickerComponent';

export default function UploadImageScreen() {
    const [image, setImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [selectedEvents, setSelectedEvents] = useState([]);

    const handleEventsLoaded = (events) => {
        setSelectedEvents(events);
        // Now you can use selectedEvents elsewhere in your app
    }

    const askPermissionIfNeeded = async () => {
        if (Platform.OS === 'web') return true;

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'We need access to your photos to pick an image.');
            return false;
        }
        return true;
    };

    const pickImage = async () => {
        const ok = await askPermissionIfNeeded();
        if (!ok) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'We need access to your camera to take a photo.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer?.files?.[0]) {
            const file = e.dataTransfer.files[0];
            const uri = URL.createObjectURL(file);
            setImage(uri);
        }
    };

    const submitImage = async () => {
        if (!image) return;
        try {
            setSubmitting(true);
            // Upload logic here
            Alert.alert('Success', 'Image submitted!');
        } catch (e) {
            Alert.alert('Error', 'Failed to submit image.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Upload your image here!</Text>

            <View
                style={styles.imageBox}
                onDragOver={(e) => Platform.OS === 'web' && e.preventDefault()}
                onDrop={(e) => Platform.OS === 'web' && handleDrop(e)}
            >
                {image ? (
                    <View style={styles.imageWrapper}>
                        <Image source={{ uri: image }} style={styles.imagePreview} />
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => setImage(null)}
                        >
                            <Ionicons name="close-circle" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.placeholder} onPress={pickImage}>
                        <Ionicons name="person-circle-outline" size={80} color="#888" />
                        <Text style={styles.placeholderText}>Tap or drag an image here</Text>
                    </TouchableOpacity>
                )}
            </View>

            <CustomButton title="Pick from Gallery" onPress={pickImage} />
            {Platform.OS !== 'web' && <CustomButton title="Take Photo" onPress={takePhoto} />}
            <CustomButton
                title="Submit image"
                onPress={submitImage}
                disabled={!image || submitting}
                loading={submitting}
            />

            <View style={styles.container}>
                <DatePickerComponent onEventsLoaded={handleEventsLoaded} />
            </View>
        </SafeAreaView>
    );
}

function CustomButton({
    title,
    onPress,
    disabled = false,
    loading = false,
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[styles.button, disabled && styles.buttonDisabled]}
            activeOpacity={0.8}
        >
            <Text style={styles.buttonText}>{loading ? 'Submitting…' : title}</Text>
        </TouchableOpacity>
    );
}

const BOX_SIZE = 180;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, alignItems: 'center', backgroundColor: '#fff' , marginBottom:50},
    header: { fontSize: 22, fontWeight: '700', marginVertical: 24 },
    imageBox: {
        width: BOX_SIZE,
        height: BOX_SIZE,
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        overflow: 'hidden',
    },
    imageWrapper: { width: '100%', height: '100%', position: 'relative' },
    imagePreview: { width: '100%', height: '100%' },
    clearButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    placeholder: { justifyContent: 'center', alignItems: 'center' },
    placeholderText: { marginTop: 8, color: '#888' },
    button: {
        width: '80%',
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 12,
    },
    buttonDisabled: { backgroundColor: '#A0A0A0' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
