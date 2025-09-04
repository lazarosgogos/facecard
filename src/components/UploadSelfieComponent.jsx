import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Button  } from "react-native";
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { supabase } from "../../lib/supabase";


export default function UploadSelfieComponent() {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const pickImage = async () => {
            
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri)
        }
    }

    const uploadAvatar = async () => {
        setLoading(true)

        setLoading(false)
    }

    const fetchAvatar = async () => {
        setLoading(true)
        const {
            data: { user },
        } = await supabase.auth.getUser()
        let UUID = user?.id

        const {data, error} = await supabase
            .storage
            .from('avatars')
            .download(`${UUID}.png`) // supposedly the filepath
        setLoading(false)
    }


    return (
        <View style={styles.container}>
            <Text style={styles.header}>Upload your image here!</Text>
            <Text style={styles.subtitle}>This will be stored as your avatar</Text>
            
            {/* Image box */}
            <View style={styles.imageBox} >
                {image ? (
                    <View style={styles.imageWrapper}>
                        <Image source={{ uri: image }} style={styles.imagePreview} />
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => setImage(null)}>
                            <Ionicons name="close-circle" size={24} color="red"/>
                        </TouchableOpacity>
                    </View>
                ) 
                : 
                (
                    <View style={styles.placeholder}>
                        <TouchableOpacity onPress={pickImage} style={styles.placeholder}>
                            <Ionicons name="person-circle-outline" size={80} color="#888" />
                                <Text style={styles.placeholderText}>Tap to upload an image or drag one here</Text>
                        </TouchableOpacity>
                    </View>
                )}                
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button title="Upload avatar" disabled={loading} onPress={() => uploadAvatar()} />
            </View>
        </View>

    )
}

const BOX_SIZE = 180;

const styles = StyleSheet.create({
    container: {flex:1, padding: 15, justifyContent:'center', alignItems:'center'},
    header: { fontSize: 22, fontWeight: '700', marginTop: 24 },
    subtitle: {fontSize: 16, fontWeight: '500', color: 'gray', marginTop: 10, marginBottom: 16},
    imageWrapper: { width: '100%', height: '100%', position: 'relative', alignContent: 'center' },
    imagePreview: { flex: 1, width: '100%', height: '100%' },
    imageBox: {
        width: BOX_SIZE,
        height: BOX_SIZE,
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        // overflow: 'hidden',
    },
    clearButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    placeholder: { justifyContent: 'center', alignItems: 'center' },
    placeholderText: { marginTop: 8, color: '#888', alignItems:'center', justifyContent:"center", textAlign:'center'},
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'auto',
    },
    mt20: {
        marginTop: 20,
    },
})