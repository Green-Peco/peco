import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockCommunities = [
	{
		id: 1,
		name: 'Green Valley',
		description: 'Protecting local forests and wildlife.',
		members: 120,
		joined: false,
	},
	{
		id: 2,
		name: 'Tree Guardians',
		description: 'Community for tree planting and care.',
		members: 85,
		joined: true,
	},
	{
		id: 3,
		name: 'Eco Rangers',
		description: 'Reporting and preventing illegal logging.',
		members: 60,
		joined: false,
	},
	{
		id: 4,
		name: 'Forest Friends',
		description: 'Connecting people who love forests.',
		members: 45,
		joined: false,
	},
	{
		id: 5,
		name: 'Wildlife Watchers',
		description: 'Observing and protecting wildlife habitats.',
		members: 70,
		joined: false,
	},
	{
		id: 6,
		name: 'Clean Rivers',
		description: 'Keeping rivers clean and safe for all.',
		members: 33,
		joined: false,
	},
	{
		id: 7,
		name: 'Urban Greeners',
		description: 'Promoting green spaces in cities.',
		members: 52,
		joined: false,
	},
];

const screenWidth = Dimensions.get('window').width;

const renderSearchBar = (search, setSearch) => (
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
);

export default function CommunityScreen() {
	const [communities, setCommunities] = useState(mockCommunities);
	const [search, setSearch] = useState('');
	const navigation = useNavigation();

	const handleJoinToggle = (id) => {
		setCommunities((prev) => {
			const updated = prev.map((c) =>
				c.id === id ? { ...c, joined: !c.joined } : c
			);
			// Find the just-joined community
			const joinedCommunity = updated.find((c) => c.id === id && c.joined);
			if (joinedCommunity) {
				// Automatically navigate to detail after joining
				navigation.navigate('CommunityDetail', { community: joinedCommunity });
			}
			return updated;
		});
		// TODO: POST /communities/{id}/join or /leave
	};

	// Filter communities by search
	const filteredCommunities = communities.filter(c =>
		c.name.toLowerCase().includes(search.toLowerCase())
	);

	const handleViewCommunity = (community) => {
		navigation.navigate('CommunityDetail', { community });
	};

	const renderCommunity = ({ item }) => (
		<View style={styles.card}>
			<Text style={styles.name}>{item.name}</Text>
			<Text style={styles.desc}>{item.description}</Text>
			<Text style={styles.members}>{item.members} members</Text>
			{!item.joined ? (
				<TouchableOpacity
					style={styles.joinBtn}
					onPress={() => handleJoinToggle(item.id)}
				>
					<Text style={{ color: '#27ae60', fontWeight: 'bold' }}>Join</Text>
				</TouchableOpacity>
			) : (
				<TouchableOpacity
					style={[styles.viewBtn, { backgroundColor: '#27ae60', borderRadius: 8 }]}
					onPress={() => handleViewCommunity(item)}
				>
					<Text style={{ color: '#fff', fontWeight: 'bold' }}>View Community</Text>
				</TouchableOpacity>
			)}
		</View>
	);

	return (
	<View style={[styles.container, { flex: 1 }]}> 
			<Text style={styles.header}>Communities</Text>
			{renderSearchBar(search, setSearch)}
			{filteredCommunities.length === 0 ? (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 32 }}>
					<Text style={{ color: '#27ae60', fontSize: 18, textAlign: 'center', marginBottom: 12 }}>
						You haven’t joined any communities yet.
					</Text>
					<Text style={{ color: '#333', fontSize: 16, textAlign: 'center', marginBottom: 24 }}>
						Join or create a community to get started!
					</Text>
					<TouchableOpacity style={[styles.createBtn, { position: 'relative', right: 0, bottom: 0 }]}> 
						<Text style={{ color: '#fff', fontWeight: 'bold' }}>Create Community</Text>
					</TouchableOpacity>
				</View>
			) : (
				<FlatList
					data={filteredCommunities}
					keyExtractor={(item) => String(item.id)}
					renderItem={renderCommunity}
					contentContainerStyle={{ paddingBottom: 32 }}
				/>
			)}
			{filteredCommunities.length !== 0 && (
				<TouchableOpacity style={styles.createBtn}>
					<Text style={{ color: '#fff', fontWeight: 'bold' }}>Create Community</Text>
				</TouchableOpacity>
			)}
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
		// elevation: 0, // remove elevation for Android shadow issues
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
		marginBottom: 8,
	},
	leaveBtn: {
		backgroundColor: '#27ae60',
		borderColor: '#27ae60',
	},
	viewBtn: {
		alignSelf: 'flex-start',
		paddingVertical: 4,
		paddingHorizontal: 12,
		marginBottom: 4,
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
	},
});
