import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, loadAsync } from 'expo-three';
import * as THREE from 'three';
import { Asset } from 'expo-asset';
// @ts-ignore
import { LoopSubdivision } from 'three-subdivide';

type Ingrediente = 'carne' | 'queso' | 'tomate' | 'lechuga';

type Hamburguesa3DProps = {
  ingredientes: Ingrediente[];
};

// Modelos disponibles
const MODELOS_INGREDIENTES: Record<Ingrediente, any> = {
  carne: require('../../assets/models/hamburguesa/Carne.glb'),
  queso: require('../../assets/models/hamburguesa/Queso.glb'),
  tomate: require('../../assets/models/hamburguesa/Tomate.glb'),
  lechuga: require('../../assets/models/hamburguesa/Lechuga.glb'),
};

export const Hamburguesa3D: React.FC<Hamburguesa3DProps> = ({ ingredientes }) => {
  const animationFrameRef = useRef<number | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const loadedPartsRef = useRef<THREE.Object3D[]>([]);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.webMessage}>
          <Text style={styles.webMessageText}>Modelo 3D</Text>
          <Text style={styles.webMessageTitle}>No disponible en web</Text>
          <Text style={styles.webMessageSubtitle}>
            Solo disponible en móvil
          </Text>
        </View>
      </View>
    );
  }

  // Lista ordenada de partes
  const buildPartsList = (ingredientes: Ingrediente[]) => {
    const parts: { file: any; name: string; scaleY: number; scaleXZ: number; gap: number }[] = [];

    // Configuración fina (ESCALAS CORREGIDAS)
    const CONFIG: Record<string, { scaleY: number; scaleXZ: number; gap: number }> = {
      carne:   { scaleY: 1.0, scaleXZ: 1.0, gap: 0.02 },

      // Queso y lechuga = MISMO tamaño que carne para que NO se salgan
      queso:   { scaleY: 0.8, scaleXZ: 1.0, gap: 0.04 },
      lechuga: { scaleY: 0.9, scaleXZ: 1.0, gap: 0.05 },

      // Tomate = MISMO ancho que carne
      tomate: { scaleY: 0.7, scaleXZ: 1.0, gap: 0.03 },
    };

    // Pan inferior
    parts.push({
      file: require('../../assets/models/hamburguesa/Pan_inferior.glb'),
      name: 'Pan Inferior',
      scaleY: 1,
      scaleXZ: 1,
      gap: 0,
    });

    // Ingredientes dinámicos (en el orden que vienen)
    ingredientes.forEach((ing) => {
      const cfg = CONFIG[ing] || { scaleY: 1, scaleXZ: 1, gap: 0 };

      parts.push({
        file: MODELOS_INGREDIENTES[ing],
        name: ing,
        scaleY: cfg.scaleY,
        scaleXZ: cfg.scaleXZ,
        gap: cfg.gap,
      });
    });

    // Pan superior
    parts.push({
      file: require('../../assets/models/hamburguesa/Pan_Superior.glb'),
      name: 'Pan Superior',
      scaleY: 1,
      scaleXZ: 1,
      gap: 0,
    });

    return parts;
  };

  const onContextCreate = async (gl: any) => {
    try {
      const renderer = new Renderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      renderer.setClearColor(0xffffff);

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Cámara
      const camera = new THREE.PerspectiveCamera(
        30,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0.3, 6);
      camera.lookAt(0, 0.3, 0);

      const parts = buildPartsList(ingredientes);

      // Limpiar modelos anteriores
      loadedPartsRef.current.forEach((part) => {
        scene.remove(part);
      });
      loadedPartsRef.current = [];

      let stackY = 0;
      let totalHeight = 0;

      for (const part of parts) {
        const asset = Asset.fromModule(part.file);
        await asset.downloadAsync();
        const model = await loadAsync(asset.uri);

        if (model.scene) {
          // Escala base general
          const baseScale = 0.45;

          const scaleY = baseScale * part.scaleY;
          const scaleXZ = baseScale * part.scaleXZ;

          model.scene.scale.set(scaleXZ, scaleY, scaleXZ);

          // Calcular caja real DESPUÉS de escalar
          const box = new THREE.Box3().setFromObject(model.scene);
          const size = new THREE.Vector3();

          box.getSize(size);

          const realHeight = size.y;

          // Posición Y apilada correctamente
          const y = stackY + realHeight / 2 + part.gap;

          // 🔥 SOLUCIÓN DEFINITIVA: FORZAR X=0, Z=0 SIEMPRE
          model.scene.position.set(0, y, 0);

          stackY += realHeight + part.gap;
          totalHeight += realHeight + part.gap;

          // Suavizado de geometría
          model.scene.traverse((child: any) => {
            if (child.isMesh && child.geometry) {
              try {
                const subdividedGeometry = LoopSubdivision.modify(
                  child.geometry,
                  2,
                  { split: true }
                );
                child.geometry.dispose();
                child.geometry = subdividedGeometry;
                child.geometry.computeVertexNormals();

                if (child.material) {
                  child.material.flatShading = false;
                  child.material.needsUpdate = true;
                }
              } catch {
                child.geometry.computeVertexNormals();
              }
            }
          });

          loadedPartsRef.current.push(model.scene);
          scene.add(model.scene);
        }
      }

      // Centrar toda la hamburguesa en Y
      const centerOffset = totalHeight / 2;
      loadedPartsRef.current.forEach((part) => {
        part.position.y -= centerOffset;
      });

      // Luces
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 1);
      keyLight.position.set(5, 8, 5);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
      fillLight.position.set(-5, 3, -5);
      scene.add(fillLight);

      // Loop de render
      let rotation = 0;
      const render = () => {
        animationFrameRef.current = requestAnimationFrame(render);

        rotation += 0.003;
        loadedPartsRef.current.forEach((part) => {
          part.rotation.y = rotation;
        });

        renderer.render(scene, camera);
        gl.endFrameEXP();
      };
      render();
    } catch (error) {
      console.error('Error al cargar modelo 3D:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <GLView
        key={ingredientes.join('-')}
        style={styles.glView}
        onContextCreate={onContextCreate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 350,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  glView: {
    flex: 1,
  },
  webMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f9fafb',
  },
  webMessageText: {
    fontSize: 32,
    marginBottom: 12,
  },
  webMessageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  webMessageSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});