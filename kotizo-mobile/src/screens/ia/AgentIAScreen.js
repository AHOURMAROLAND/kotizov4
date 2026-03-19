import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import api from '../../services/api';
import { Colors } from '../../utils/colors';

const SUGGESTIONS = [
  'Comment creer une cotisation ?',
  'Comment payer ma cotisation ?',
  'Quels sont les operateurs disponibles ?',
];

export default function AgentIAScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [statut, setStatut] = useState({ count: 0, limite: 3, disponible: true });
  const flatListRef = useRef(null);

  useEffect(() => {
    chargerHistorique();
    chargerStatut();
  }, []);

  const chargerHistorique = async () => {
    try {
      const res = await api.get('/agent/historique/');
      setMessages(res.data.messages.map(m => ({
        role: m.role, texte: m.contenu, id: Math.random().toString()
      })));
    } catch {}
  };

  const chargerStatut = async () => {
    try {
      const res = await api.get('/agent/statut/');
      setStatut(res.data);
    } catch {}
  };

  const envoyer = async (texte) => {
    const msg = texte || input;
    if (!msg.trim() || loading) return;
    setInput('');

    const msgUser = { role: 'user', texte: msg, id: Math.random().toString() };
    setMessages(prev => [...prev, msgUser]);
    setLoading(true);

    try {
      const res = await api.post('/agent/message/', { message: msg });
      const msgIA = { role: 'assistant', texte: res.data.reponse, id: Math.random().toString() };
      setMessages(prev => [...prev, msgIA]);
      setStatut(prev => ({ ...prev, count: res.data.count }));
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === 'limite_ia') {
        navigation.navigate('LimiteIA', { count: statut.count, limite: statut.limite });
      } else {
        const msgErreur = { role: 'assistant', texte: 'Erreur technique. Reessayez.', id: Math.random().toString() };
        setMessages(prev => [...prev, msgErreur]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.retour}>Fermer</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Assistant Kotizo</Text>
        <Text style={styles.compteur}>{statut.count}/{statut.limite}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messages}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={
          <View style={styles.suggestions}>
            <Text style={styles.suggestionsLabel}>Suggestions</Text>
            {SUGGESTIONS.map(s => (
              <TouchableOpacity key={s} style={styles.suggestion} onPress={() => envoyer(s)}>
                <Text style={styles.suggestionTexte}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        }
        renderItem={({ item }) => (
          <View style={[
            styles.bulle,
            item.role === 'user' ? styles.bulleUser : styles.bulleIA
          ]}>
            <Text style={[
              styles.bulleTexte,
              item.role === 'user' ? styles.bulleTexteUser : styles.bulleTexteIA
            ]}>
              {item.texte}
            </Text>
          </View>
        )}
      />

      {loading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingTexte}>En train de repondre...</Text>
        </View>
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Posez votre question..."
          placeholderTextColor={Colors.grey}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.btnEnvoyer, (!input.trim() || loading) && styles.btnDesactive]}
          onPress={() => envoyer()}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.btnEnvoyerTexte}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingTop: 56,
    paddingHorizontal: 24, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.greyBorder,
  },
  retour: { color: Colors.primary, fontSize: 16 },
  titre: { fontSize: 16, fontWeight: 'bold', color: Colors.black },
  compteur: { fontSize: 13, color: Colors.grey },
  messages: { padding: 16, gap: 12 },
  suggestions: { gap: 10, marginTop: 16 },
  suggestionsLabel: { fontSize: 14, color: Colors.grey, marginBottom: 4 },
  suggestion: {
    backgroundColor: Colors.primaryLight, borderRadius: 12,
    padding: 12, borderWidth: 1, borderColor: Colors.primary + '40',
  },
  suggestionTexte: { color: Colors.primary, fontSize: 14 },
  bulle: { maxWidth: '80%', borderRadius: 16, padding: 12 },
  bulleUser: { backgroundColor: Colors.primary, alignSelf: 'flex-end' },
  bulleIA: { backgroundColor: Colors.greyLight, alignSelf: 'flex-start' },
  bulleTexte: { fontSize: 15, lineHeight: 22 },
  bulleTexteUser: { color: Colors.white },
  bulleTexteIA: { color: Colors.black },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8 },
  loadingTexte: { fontSize: 13, color: Colors.grey },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: Colors.greyBorder, gap: 8,
  },
  input: {
    flex: 1, borderWidth: 1, borderColor: Colors.greyBorder,
    borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 15, color: Colors.black, backgroundColor: Colors.greyLight,
    maxHeight: 100,
  },
  btnEnvoyer: {
    backgroundColor: Colors.primary, paddingHorizontal: 16,
    paddingVertical: 10, borderRadius: 16,
  },
  btnDesactive: { backgroundColor: Colors.greyBorder },
  btnEnvoyerTexte: { color: Colors.white, fontSize: 14, fontWeight: 'bold' },
});