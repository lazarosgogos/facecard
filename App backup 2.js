import React, {useState} from 'react';
import {View, Text, Button, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Ionicons} from '@expo/vector-icons';
import { supabase } from './lib/supabase';

export default function App(){

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }
  const clearImage = () => {
    setImage(null);
    // alert("Image cleared!");
  }
  return (
    <View style={styles.container}> 
      <Text style={styles.header}>Upload your image here!</Text>
      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {image ? (<Image source={{uri:image}} style={styles.imagePreview}/>) : (<Ionicons name="person-circle-outline" size={80} color="#888"/>)}
      </TouchableOpacity>
      
      <Button style={styles.buttons} title="Submit image" onPress={() => alert("Image submitted!")} />
      <Button style={styles.buttons} title="Clear image" onPress={clearImage}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {flex:1, alignItems: 'center', justifyContent: 'center', padding: 20},
  header: {fontSize: 22, fontWeight: 'bold', marginBottom: 20},
  imageBox: {width: 150, height: 150, borderWidth: 2, borderColor: '#ccc', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 20},
  imagePreview: {width: '100%', height: '100%', borderRadius:10},
});