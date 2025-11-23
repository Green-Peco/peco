// MapScreen: show reports on map, tap marker for preview
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

let MapView;
if (Platform.OS !== 'web') {
  MapView = require('react-native-maps').default;
}
import { getReports } from '../services/api';
import { useNavigation } from '@react-navigation/native';

export default function MapScreen() {
  const navigation = useNavigation();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function fetchReports() {
      const res = await getReports();
      setReports(res.data);
    }
    fetchReports();
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Map is not available on web. Please use a mobile device.</Text>
      </View>
    );
  }

  useEffect(() => {
    async function fetchReports() {
      const res = await getReports();
      setReports(res.data);
    }
    fetchReports();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }}>
        {reports.map((r) => (
          <Marker
            key={r.id}
            coordinate={{ latitude: r.lat, longitude: r.lon }}
            title={r.title}
            description={r.description}
            onPress={() => navigation.navigate('FeedDetail', { id: r.id })}
          />
        ))}
      </MapView>
      <View style={{ position: 'absolute', top: 40, left: 0, right: 0, alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#388e3c', backgroundColor: 'white', padding: 8, borderRadius: 8 }}>Map (Main Feature)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
