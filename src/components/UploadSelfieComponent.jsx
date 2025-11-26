import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Button, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../ThemeContext";


export default function UploadSelfieComponent({ handleChangeInStatus }) {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();
    const styles = getStyles(theme);

    useEffect(() => {
        fetchAvatar();
    }, []);

    useEffect(() => {
        st = checkStatus()
        handleChangeInStatus(st)
    }, [image])

    const checkStatus = () => {
        const avatarExistsInDatabase = hasAvatarInDatabase();

        if (image && !avatarExistsInDatabase) {
            return false;
        } else if (!image && !avatarExistsInDatabase) {
            return false;
        } else if (image && avatarExistsInDatabase) {
            return true
        }
    }



    const hasAvatarInDatabase = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const UUID = user?.id;

            if (UUID) {
                const { data, error } = await supabase.storage
                    .from('avatars')
                    .list(UUID, {
                        limit: 1,
                        search: 'avatar.png'
                    });

                if (error) {
                    console.log('Could not check avatar:', error);
                    return false;
                }

                return data && data.length > 0;
            }
            return false;
        } catch (error) {
            console.log('Error checking avatar:', error);
            return false;
        }
    }

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri)
        }
    }

    const uploadAvatar = async () => {
        if (!image) {
            Alert.alert('No image selected');
            return;
        }

        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const UUID = user?.id;

            if (!UUID) {
                Alert.alert('User not found');
                return;
            }

            const response = await fetch(image);
            const blob = await response.blob();

            const { data, error } = await supabase.storage
                .from('avatars')
                .upload(`${UUID}/avatar.png`, blob, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (error) {
                Alert.alert('Upload failed', error.message);
                console.log('Upload failed', error.message);
            } else {
                Alert.alert('Upload successful');
            }
        } catch (error) {
            Alert.alert('Upload error', error.message);
        }

        setLoading(false);
    }

    const fetchAvatar = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const UUID = user?.id;

            if (UUID) {
                const { data, error } = await supabase.storage
                    .from('avatars')
                    .download(`${UUID}/avatar.png`);
                if (error) console.log('Could not fetch avatar:', error)

                if (data && !error) {
                    const fr = new FileReader();
                    fr.readAsDataURL(data);
                    fr.onload = () => {
                        setImage(fr.result);
                    };
                }
            }
        } catch (error) {
            console.log('Error fetching avatar:', error);
        }
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Upload your image here!</Text>
            <Text style={styles.subtitle}>This will be stored as your avatar</Text>

            <View style={styles.imageBox} >
                {image ? (
                    <View style={styles.imageWrapper}>
                        <Image source={{ uri: image }} style={styles.imagePreview} />
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => setImage(null)}>
                            <Ionicons name="close-circle" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                )
                    :
                    (
                        <View style={styles.placeholder}>
                            <TouchableOpacity onPress={pickImage} style={styles.placeholder}>
                                <Ionicons name="person-circle-outline" size={80} color={theme.tertiary} />
                                <Text style={styles.placeholderText}>Tap to upload an image or drag one here</Text>
                            </TouchableOpacity>
                        </View>
                    )}
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button title="Upload avatar" disabled={loading || !image} onPress={() => uploadAvatar()} color={theme.primary} />
            </View>
            <View style={[styles.verticallySpaced]}>
                <Button title="Change image" disabled={loading} onPress={pickImage} color={theme.primary} />
            </View>
        </View>
    )
}

const BOX_SIZE = 180;

const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, padding: 6, justifyContent: 'center', alignItems: 'center', borderWidth: 0, borderRadius: 20 },
    header: { fontSize: 22, fontWeight: '700', marginTop: 12, color: theme.text },
    subtitle: { fontSize: 16, fontWeight: '500', color: theme.secondary, marginTop: 10, marginBottom: 16 },
    imageWrapper: { width: '100%', height: '100%', position: 'relative', alignContent: 'center' },
    imagePreview: { flex: 1, width: '100%', height: '100%', borderRadius: 12 },
    imageBox: {
        width: BOX_SIZE,
        height: BOX_SIZE,
        borderWidth: 2,
        borderColor: theme.border,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    clearButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: theme.background,
        borderRadius: 12,
    },
    placeholder: { justifyContent: 'center', alignItems: 'center' },
    placeholderText: { marginTop: 8, color: theme.tertiary, alignItems: 'center', justifyContent: "center", textAlign: 'center' },
    verticallySpaced: {
        padding: 4,
        alignSelf: 'auto',
    },
    mt20: {
    },
})
