import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Dimensions, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext'; // To potentially show join/leave based on user's communities

const screenWidth = Dimensions.get('window').width;

export default function CommunityScreen() {
	const [communities, setCommunities] = useState([]);
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const router = useRouter();
	const { user } = useAuth(); // Assuming user has a list of joined community IDs

	const fetchCommunities = async () => {
		try {
			setLoading(true);
			const response = await api.getCommunities();
			// For now, let's assume 'joined' status needs to be checked on frontend if user has a list of joined communities
			const fetchedCommunities = response.data.communities.map(comm => ({
				...comm,
				joined: false, // This would be dynamic based on user.joinedCommunityIds
			}));
			setCommunities(fetchedCommunities);
		} catch (error) {
			console.error("Failed to fetch communities:", error);
			Alert.alert("Error", "Could not load communities.");
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchCommunities();
		}, [])
	);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchCommunities();
	}, []);

	const handleJoinToggle = async (id, name) => {
		try {
			await api.joinCommunity(id);
			Alert.alert('Success', `You have joined "${name}"!`);
			fetchCommunities(); // Refresh list to show updated status
		} catch (error) {
			console.error("Failed to join community:", error);
			const errorMessage = error.response?.data?.error || 'Could not join community.';
			Alert.alert("Error", errorMessage);
		}
	};

	const handleViewCommunity = (community) => {
		router.push({ pathname: 'CommunityDetailScreen', params: { communityId: community.id } });
	};

	const filteredCommunities = communities.filter(c =>
		c.name.toLowerCase().includes(search.toLowerCase())
	);

	const renderCommunity = ({ item }) => (
		<View style={styles.card}>
			<Text style={styles.name}>{item.name}</Text>
			<Text style={styles.desc}>{item.description}</Text>
			{/* Members count is not yet available from backend */}
			{/* <Text style={styles.members}>{item.members} members</Text> */}
			
			{/* Simplified join/view logic for now */}
			<TouchableOpacity
				style={[styles.joinBtn, item.joined && styles.viewBtn]}
				onPress={() => item.joined ? handleViewCommunity(item) : handleJoinToggle(item.id, item.name)}
			>
				<Text style={{ color: item.joined ? '#fff' : '#27ae60', fontWeight: 'bold' }}>
					{item.joined ? 'View Community' : 'Join'}
				</Text>
			</TouchableOpacity>
		</View>
	);

	if (loading && !refreshing) {
		return (
			<View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
				<ActivityIndicator size="large" color="#27ae60" />
			</View>
		);
	}

	return (
		<View style={[styles.container, { flex: 1 }]}>
			<Text style={styles.header}>Communities</Text>
			<View style={styles.searchBarWrapper}>
				<TextInput
					style={styles.searchBar}
					placeholder="Search communities..."
					placeholderTextColor="#27ae60"
					value={search}
					onChangeText={setSearch}
				/>
				<Ionicons name="search" size={22} color="#27ae60" style={styles.searchIcon} />
			</View>
			
			<FlatList
				data={filteredCommunities}
				keyExtractor={(item) => String(item.id)}
				renderItem={renderCommunity}
				contentContainerStyle={{ paddingBottom: 32 }}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#27ae60"]} tintColor="#27ae60" />
				}
				ListEmptyComponent={!loading && !refreshing && (
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 32 }}>
						<Text style={{ color: '#27ae60', fontSize: 18, textAlign: 'center', marginBottom: 12 }}>
							No communities found.
						</Text>
						<Text style={{ color: '#333', fontSize: 16, textAlign: 'center', marginBottom: 24 }}>
							Create one to get started!
						</Text>
					</View>
				)}
			/>
			
			<TouchableOpacity style={styles.createBtn} onPress={() => router.push('CreateCommunityScreen')}>
				<Text style={{ color: '#fff', fontWeight: 'bold' }}>Create Community</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#eafaf1', // green-tinted soft background
		paddingTop: 32, // move header further down
		paddingHorizontal: 12, // add padding for consistent card spacing
	},
	header: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#27ae60',
		textAlign: 'center',
		marginTop: 48, // move header further down
		marginBottom: 8,
	},
	searchBarWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 8,
		borderColor: '#27ae60',
		borderWidth: 1,
		paddingHorizontal: 10,
		marginBottom: 8,
	},
	searchIcon: {
		marginLeft: 6,
	},
	searchBar: {
		flex: 1,
		backgroundColor: 'transparent',
		borderRadius: 8,
		fontSize: 16,
		color: '#27ae60',
		padding: 10,
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 16,
		width: '100%', // use full width of container
		marginVertical: 10,
		padding: 18,
		borderColor: '#27ae60',
		borderWidth: 1,
		shadowColor: '#27ae60',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 6,
	},
	name: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#27ae60',
		marginBottom: 4,
	},
	desc: {
		fontSize: 14,
		color: '#333',
		marginBottom: 8,
	},
	members: {
		fontSize: 12,
		color: '#27ae60',
		marginBottom: 8,
	},
	joinBtn: {
		backgroundColor: '#eafaf1',
		borderRadius: 8,
		borderColor: '#27ae60',
		borderWidth: 1,
		paddingVertical: 8,
		paddingHorizontal: 24,
		alignSelf: 'flex-start',
		marginTop: 8,
	},
	viewBtn: {
		backgroundColor: '#27ae60',
		color: '#fff', // Text color needs to be set directly on Text component
	},
	createBtn: {
		position: 'absolute',
		right: 24,
		bottom: 24,
		backgroundColor: '#27ae60',
		borderRadius: 24,
		paddingVertical: 12,
		paddingHorizontal: 24,
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
});