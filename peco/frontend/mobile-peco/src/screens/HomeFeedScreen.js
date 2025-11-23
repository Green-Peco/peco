import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import FeedCard from "../components/FeedCard";

export default function HomeFeedScreen({ navigation }) {
  const [sort, setSort] = useState("all");
  const [feedItems, setFeedItems] = useState([
    // REPORT
    {
      id: 1,
      type: "REPORT",
      title: "Illegal Logging Reported",
      author: "ranger_jane",
      excerpt: "Fresh stumps and cut trees found near river trail. Authorities notified.",
      location: "River Trail",
      votes: 12,
      comments: 3,
      timeAgo: "2h",
      verified: true,
      thumbnail: undefined,
    },
    {
      id: 2,
      type: "REPORT",
      title: "Suspicious Activity in Forest",
      author: "ranger_john",
      excerpt: "Unmarked vehicles seen near protected area. Investigation ongoing.",
      location: "East Forest",
      votes: 7,
      comments: 2,
      timeAgo: "4h",
      verified: false,
      thumbnail: undefined,
    },
    {
      id: 3,
      type: "REPORT",
      title: "Illegal Grazing Detected",
      author: "ranger_sam",
      excerpt: "Cattle found grazing in restricted zone. Action taken.",
      location: "South Meadow",
      votes: 5,
      comments: 1,
      timeAgo: "1h",
      verified: false,
      thumbnail: undefined,
    },
    // NEWS
    {
      id: 4,
      type: "NEWS",
      title: "New Trees Planted in City Park",
      author: "PECO team",
      excerpt: "Over 500 saplings planted to improve air quality and biodiversity.",
      location: "City Park",
      votes: 8,
      comments: 1,
      timeAgo: "1h",
      verified: false,
      thumbnail: undefined,
    },
    {
      id: 5,
      type: "NEWS",
      title: "Environmental Awareness Week Announced",
      author: "PECO team",
      excerpt: "Join us for events and workshops to protect our forests.",
      location: "PECO HQ",
      votes: 10,
      comments: 4,
      timeAgo: "5h",
      verified: false,
      thumbnail: undefined,
    },
    {
      id: 6,
      type: "NEWS",
      title: "Local School Wins Green Award",
      author: "eco_news",
      excerpt: "Students recognized for tree planting and recycling efforts.",
      location: "Green Valley School",
      votes: 6,
      comments: 2,
      timeAgo: "2h",
      verified: false,
      thumbnail: undefined,
    },
    // LESSON
    {
      id: 7,
      type: "LESSON",
      title: "How to Protect Forests from Threats",
      author: "mentor_ali",
      excerpt: "Learn to spot illegal mining, logging, and how to report them.",
      location: "North Ridge",
      votes: 15,
      comments: 5,
      timeAgo: "3h",
      verified: false,
      thumbnail: undefined,
    },
    {
      id: 8,
      type: "LESSON",
      title: "Tree Planting Techniques",
      author: "mentor_sara",
      excerpt: "Best practices for planting and caring for young trees.",
      location: "Training Center",
      votes: 9,
      comments: 2,
      timeAgo: "6h",
      verified: false,
      thumbnail: undefined,
    },
    {
      id: 9,
      type: "LESSON",
      title: "Identifying Threats to Trees",
      author: "mentor_luke",
      excerpt: "How to recognize pests and diseases in forest environments.",
      location: "Forest Lab",
      votes: 11,
      comments: 3,
      timeAgo: "2h",
      verified: false,
      thumbnail: undefined,
    },
    // DISCUSSION
    {
      id: 10,
      type: "DISCUSSION",
      title: "Best Practices for Fire Prevention in Forests",
      author: "eco_warrior",
      excerpt: "Share your tips and experiences to keep our forests safe from wildfires.",
      location: "Community Forum",
      votes: 20,
      comments: 10,
      timeAgo: "30m",
      verified: false,
      thumbnail: undefined,
    },
    {
      id: 11,
      type: "DISCUSSION",
      title: "How to Encourage Community Involvement",
      author: "forest_friend",
      excerpt: "Ideas for getting more people to help protect the environment.",
      location: "Online Forum",
      votes: 13,
      comments: 6,
      timeAgo: "2h",
      verified: false,
      thumbnail: undefined,
    },
    {
      id: 12,
      type: "DISCUSSION",
      title: "Debate: Logging vs. Conservation",
      author: "green_debater",
      excerpt: "Discuss the balance between resource use and forest protection.",
      location: "Debate Hall",
      votes: 17,
      comments: 8,
      timeAgo: "1h",
      verified: false,
      thumbnail: undefined,
    },
  ]);

  // Filter feedItems by selected chip
  const filteredItems = sort === "all"
    ? feedItems
    : feedItems.filter(item => item.type.toLowerCase() === sort);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar: centered PECO logo */}
      <View style={styles.headerRowCentered}>
        <Text style={styles.logoText}>PECO</Text>
      </View>

      {/* Filter chip row: All, Report, News, Lesson, Discussion */}
      <View style={styles.filterRow}>
        {["All", "Report", "News", "Lesson", "Discussion"].map((chip) => (
          <TouchableOpacity
            key={chip}
            style={[
              styles.filterChip,
              sort === chip.toLowerCase() && styles.filterChipActive,
            ]}
            onPress={() => setSort(chip.toLowerCase())}
          >
            <Text
              style={{
                color: sort === chip.toLowerCase() ? "#fff" : "#27ae60",
                fontWeight: "bold",
              }}
            >
              {chip}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* FloatingActionButton: Create */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateReport")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Feed list */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <FeedCard item={item} navigation={navigation} />}
        contentContainerStyle={{ paddingBottom: 80 }}
        // ...add pull-to-refresh, infinite scroll props as needed...
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerRowCentered: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#27ae60", // green accent
    letterSpacing: 2,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: "#eafaf1",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderColor: "#27ae60",
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: "#27ae60",
    borderColor: "#27ae60",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    backgroundColor: "#27ae60",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    zIndex: 10,
  },
  fabText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
});
