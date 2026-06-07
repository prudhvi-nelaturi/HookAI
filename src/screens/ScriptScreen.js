import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { Colors } from '../constants/colors';
import { generateScript } from '../services/claudeService';

export default function ScriptScreen({ route }) {
  const idea = route?.params?.idea || null;
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (idea) fetchScript(idea);
  }, [idea]);

  const fetchScript = async (selectedIdea) => {
    setLoading(true);
    setScript(null);
    try {
      const result = await generateScript(selectedIdea);
      setScript(result);
    } finally {
      setLoading(false);
    }
  };

  if (!idea) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyText}>Pick an idea from the Ideas tab to generate a full script</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.ideaTitle}>{idea.title}</Text>

        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={Colors.primary} size="large" />
            <Text style={styles.loadingText}>Writing your script...</Text>
          </View>
        )}

        {script && (
          <>
            <Section title="🎣 Hook (First 3 Seconds)" content={script.hook} highlight />
            <Section title="📖 Script" content={script.script} />
            <Section title="🎬 Visuals" content={script.visuals} />
            <Section title="🎵 Music Vibe" content={script.music} />
            <Section title="✏️ Caption" content={script.caption} />
            <Section title="#️⃣ Hashtags" content={script.hashtags} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, content, highlight }) {
  return (
    <View style={[styles.section, highlight && styles.sectionHighlight]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { color: Colors.textMuted, textAlign: 'center', fontSize: 15, lineHeight: 22 },
  ideaTitle: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 20 },
  loadingBox: { alignItems: 'center', paddingVertical: 40 },
  loadingText: { color: Colors.textMuted, marginTop: 12, fontSize: 14 },
  section: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHighlight: { borderColor: Colors.primary },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  sectionContent: { fontSize: 14, color: Colors.text, lineHeight: 22 },
});
