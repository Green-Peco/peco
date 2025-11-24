// CreateReportScreen: capture photo, get GPS, submit report
// Require photo + location to publish
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { createReport } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateReportScreen({ navigation }) {
  const [photo, setPhoto] = useState(null);
  const [coords, setCoords] = useState(null);
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);

  const pickPhoto = async () => {
    let result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) setPhoto(result);
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied');
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setCoords(loc.coords);
  };

  const handleSubmit = async () => {
    if (!photo || !coords) {
      Alert.alert('Photo and location required');
      return;
    }
    setLoading(true);
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      const formData = new FormData();
      formData.append('user_id', user_id);
      formData.append('lat', coords.latitude);
      formData.append('lon', coords.longitude);
      formData.append('description', desc);
      formData.append('photo', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });
      await createReport(formData);
      Alert.alert('Success');
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert('Error', 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Create Report</Text>
      <Button title="Take Photo" onPress={pickPhoto} />
      <Button title="Get Location" onPress={getLocation} />
      <TextInput placeholder="Description" value={desc} onChangeText={setDesc} style={{ borderWidth: 1, marginVertical: 12, padding: 8 }} />
      <Button title="Submit" onPress={handleSubmit} disabled={loading} />
    </View>
  );
}
// ...existing code...
