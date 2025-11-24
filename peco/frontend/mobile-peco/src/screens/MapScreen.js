// MapScreen: show reports on map, tap marker for preview
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';

let MapView;
let Marker;
if (Platform.OS !== 'web') {
  MapView = require('react-native-maps').default;
  Marker = require('react-native-maps').Marker;
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
          <Animatable.View
            key={r.id}
            animation="bounceIn"
            duration={1200}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <Marker
              coordinate={{ latitude: r.lat, longitude: r.lon }}
              title={r.title}
              description={r.description}
              onPress={() => navigation.navigate('FeedDetail', { id: r.id })}
            />
          </Animatable.View>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
