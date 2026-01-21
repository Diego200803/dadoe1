// app/index.tsx

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🎮 Magic 3D</Text>
          <Text style={styles.subtitle}>Elige tu experiencia 3D</Text>
        </View>

        <View style={styles.menuContainer}>
          {/* Opción Dado */}
          <TouchableOpacity
            style={[styles.menuButton, styles.diceButton]}
            onPress={() => router.push('/games/dice')}
          >
            <Text style={styles.menuIcon}>🎲</Text>
            <Text style={styles.menuTitle}>Magic Dice</Text>
            <Text style={styles.menuDescription}>
              Agita tu teléfono para lanzar el dado
            </Text>
          </TouchableOpacity>

          {/* Opción Hamburguesa */}
          <TouchableOpacity
            style={[styles.menuButton, styles.burgerButton]}
            onPress={() => router.push('/games/hamburguesa')}
          >
            <Text style={styles.menuIcon}>🍔</Text>
            <Text style={styles.menuTitle}>Hamburguesa 3D</Text>
            <Text style={styles.menuDescription}>
              Visualiza el modelo 3D interactivo
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Desarrollado con React Native + Expo + Three.js
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  menuContainer: {
    gap: 20,
  },
  menuButton: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  diceButton: {
    backgroundColor: '#3b82f6',
  },
  burgerButton: {
    backgroundColor: '#10b981',
  },
  menuIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  menuDescription: {
    fontSize: 14,
    color: '#e2e8f0',
    textAlign: 'center',
  },
  footer: {
    marginTop: 50,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});