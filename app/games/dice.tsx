// app/games/dice.tsx

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DiceFace } from '@/components/atoms/DiceFace';
import { ShakeIndicator } from '@/components/molecules/ShakeIndicator';
import { useShakeDetection } from '@/lib/hooks/useShakeDetection';
import { rollDice } from '@/lib/core/logic/motion';

export default function DiceGame() {
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [rollCount, setRollCount] = useState<number>(0);

  const handleShake = useCallback(() => {
    if (!isRolling) {
      performRoll();
    }
  }, [isRolling]);

  const { isAvailable } = useShakeDetection(handleShake, true);

  const performRoll = () => {
    setIsRolling(true);

    let counter = 0;
    const maxRolls = 5;

    const interval = setInterval(() => {
      setDiceValue(rollDice());
      counter++;

      if (counter >= maxRolls) {
        clearInterval(interval);
        setDiceValue(rollDice());
        setIsRolling(false);
        setRollCount((prev) => prev + 1);
      }
    }, 100);
  };

  const handleManualRoll = () => {
    if (!isRolling) {
      performRoll();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>🎲 Magic Dice</Text>
            <Text style={styles.subtitle}>
              {isAvailable ? '¡Agita tu teléfono!' : 'Usa el botón'}
            </Text>
          </View>

          <ShakeIndicator />

          <View style={styles.diceContainer}>
            <DiceFace value={diceValue} isRolling={isRolling} />
          </View>

          {!isRolling && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Resultado</Text>
              <Text style={styles.resultValue}>{diceValue}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, isRolling && styles.buttonDisabled]}
            onPress={handleManualRoll}
            disabled={isRolling}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isRolling ? '🎲 Lanzando...' : '🎲 Lanzar Dado'}
            </Text>
          </TouchableOpacity>

          <View style={styles.stats}>
            <Text style={styles.statsText}>
              Lanzamientos totales: {rollCount}
            </Text>
          </View>

          {!isAvailable && Platform.OS !== 'web' && (
            <View style={styles.warning}>
              <Text style={styles.warningText}>⚠️ Acelerómetro no disponible</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#f8fafc',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  diceContainer: {
    marginVertical: 30,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#475569',
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  stats: {
    marginTop: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 12,
    marginBottom: 20,
  },
  statsText: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  warning: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  warningText: {
    color: '#fca5a5',
    fontSize: 12,
  },
});