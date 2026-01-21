// app/games/hamburguesa.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Hamburguesa3D } from '@/components/atoms/Hamburguesa3D';

export default function HamburguesaScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🍔 Hamburguesa 3D</Text>
            <Text style={styles.subtitle}>Modelo interactivo con 6 partes</Text>
          </View>

          {/* Visor 3D */}
          <View style={styles.viewerContainer}>
            <Hamburguesa3D />
          </View>

          {/* Lista de partes */}
          <View style={styles.partsContainer}>
            <Text style={styles.partsTitle}>Componentes:</Text>
            
            <View style={styles.partsList}>
              {[
                '🍞 Pan Superior',
                '🥬 Lechuga',
                '🍅 Tomate',
                '🧀 Queso',
                '🥩 Carne',
                '🍞 Pan Inferior',
              ].map((part, index) => (
                <View key={index} style={styles.partItem}>
                  <Text style={styles.partText}>{part}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Info adicional */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 La hamburguesa rota automáticamente para mostrar todos los ángulos
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  viewerContainer: {
    marginVertical: 30,
    alignItems: 'center',
  },
  partsContainer: {
    width: '100%',
    maxWidth: 400,
    marginTop: 30,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  partsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  partsList: {
    gap: 12,
  },
  partItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  partText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  infoBox: {
    marginTop: 30,
    padding: 16,
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    maxWidth: 400,
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
});