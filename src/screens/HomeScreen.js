import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { Colors } from '../constants/colors';
import { generateIdeas } from '../services/claudeService';

export default function HomeScreen({ navigation }) {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const result = await generateIdeas();
      setIdeas(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>HookAI</Text>
        <Text style={styles.subtitle}>Your daily viral content engine</Text>
      </View>

      <TouchableOpacity style={styles.generateBtn} onPress={fetchIdeas} disabled={loading}>
        {loading
          ? <ActivityIndicator color={Colors.text} />
          : <Text style={styles.generateBtnText}>⚡ Generate Today's Ideas</Text>}
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.list}>
        {ideas.map((idea, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate('Script', { idea })}
          >
            <Text style={styles.cardIndex}>#{index + 1}</Text>
            <Text style={styles.cardTitle}>{idea.title}</Text>
            <Text style={styles.cardHook}>🎣 {idea.hook}</Text>
            <View style={styles.cardMeta}>
              <Text style={styles.cardTag}>{idea.format}</Text>
              <Text style={styles.cardTag}>{idea.duration}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  logo: { fontSize: 28, fontWeight: '800', color: Colors.primary },
  subtitle: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  generateBtn: {
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  generateBtnText: { color: Colors.text, fontWeight: '700', fontSize: 16 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardIndex: { fontSize: 11, color: Colors.primary, fontWeight: '700', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  cardHook: { fontSize: 13, color: Colors.textMuted, marginBottom: 10 },
  cardMeta: { flexDirection: 'row', gap: 8 },
  cardTag: {
    backgroundColor: Colors.border,
    color: Colors.textMuted,
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '600',
  },
});
