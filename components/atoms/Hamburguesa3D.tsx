// components/atoms/Hamburguesa3D.tsx

import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, loadAsync } from 'expo-three';
import * as THREE from 'three';
import { Asset } from 'expo-asset';

// 🔥 RUTAS CORREGIDAS (SIN @/)
const BURGER_PARTS = [
  { name: 'Pan Superior', file: require('../../assets/models/hamburguesa/Pan_superior.glb'), y: 0.8 },
  { name: 'Lechuga', file: require('../../assets/models/hamburguesa/Lechuga.glb'), y: 0.6 },
  { name: 'Tomate', file: require('../../assets/models/hamburguesa/Tomate.glb'), y: 0.4 },
  { name: 'Queso', file: require('../../assets/models/hamburguesa/Queso.glb'), y: 0.25 },
  { name: 'Carne', file: require('../../assets/models/hamburguesa/Carne.glb'), y: 0.1 },
  { name: 'Pan Inferior', file: require('../../assets/models/hamburguesa/Pan_inferior.glb'), y: -0.1 },
];

export const Hamburguesa3D: React.FC = () => {
  const animationFrameRef = useRef<number | null>(null);

  const onContextCreate = async (gl: any) => {
    try {
      const renderer = new Renderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      renderer.setClearColor(0xffffff);

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        50,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0.4, 2.5);
      camera.lookAt(0, 0.4, 0);

      const loadedParts: THREE.Object3D[] = [];

      for (const part of BURGER_PARTS) {
        const asset = Asset.fromModule(part.file);
        await asset.downloadAsync();

        const model = await loadAsync(asset.uri);

        if (model.scene) {
          model.scene.position.y = part.y;
          model.scene.scale.set(1, 1, 1);

          const box = new THREE.Box3().setFromObject(model.scene);
          const center = box.getCenter(new THREE.Vector3());
          model.scene.position.x -= center.x;
          model.scene.position.z -= center.z;

          loadedParts.push(model.scene);
          scene.add(model.scene);
        }
      }

      // 💡 Luces
      scene.add(new THREE.AmbientLight(0xffffff, 0.8));

      const keyLight = new THREE.DirectionalLight(0xffffff, 1);
      keyLight.position.set(5, 8, 5);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
      fillLight.position.set(-5, 3, -5);
      scene.add(fillLight);

      const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
      backLight.position.set(0, 3, -8);
      scene.add(backLight);

      let rotation = 0;
      const render = () => {
        animationFrameRef.current = requestAnimationFrame(render);
        rotation += 0.003;

        loadedParts.forEach((part) => {
          part.rotation.y = rotation;
        });

        renderer.render(scene, camera);
        gl.endFrameEXP();
      };

      render();
    } catch (error) {
      console.error('❌ Error cargando modelo 3D:', error);
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
      <GLView style={styles.glView} onContextCreate={onContextCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 400,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 10,
  },
  glView: {
    flex: 1,
  },
});
