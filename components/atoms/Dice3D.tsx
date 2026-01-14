// components/atoms/Dice3D.tsx

import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, loadAsync } from 'expo-three';
import * as THREE from 'three';
import { Asset } from 'expo-asset';

type Dice3DProps = {
  isRolling: boolean;
  value: number;
};

export const Dice3D: React.FC<Dice3DProps> = ({ isRolling, value }) => {
  const rendererRef = useRef<any>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const diceRef = useRef<THREE.Object3D | null>(null);
  const rotationSpeedRef = useRef({ x: 0, y: 0, z: 0 });
  const animationFrameRef = useRef<number | null>(null);

  const onContextCreate = async (gl: any) => {
    try {
      // Renderer
      const renderer = new Renderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      renderer.setClearColor(0x0f172a);
      rendererRef.current = renderer;

      // Scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(
        50,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 6);
      cameraRef.current = camera;

      // Cargar el modelo GLB (nombre con guiones bajos)
      const asset = Asset.fromModule(require('../../assets/models/dado_de_6_caras.glb'));
      await asset.downloadAsync();

      // Cargar el modelo usando expo-three
      const model = await loadAsync(asset.uri);
      
      // Configurar el modelo
      if (model.scene) {
        const dice = model.scene;
        
        // Ajustar escala si es necesario
        dice.scale.set(1, 1, 1);
        
        // Centrar el modelo
        const box = new THREE.Box3().setFromObject(dice);
        const center = box.getCenter(new THREE.Vector3());
        dice.position.sub(center);
        
        diceRef.current = dice;
        scene.add(dice);
      }

      // Luces
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0x3b82f6, 0.5);
      pointLight.position.set(-5, -5, 5);
      scene.add(pointLight);

      // Luz de relleno
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
      fillLight.position.set(-5, 0, -5);
      scene.add(fillLight);

      // Loop de renderizado
      const render = () => {
        animationFrameRef.current = requestAnimationFrame(render);

        if (diceRef.current) {
          diceRef.current.rotation.x += rotationSpeedRef.current.x;
          diceRef.current.rotation.y += rotationSpeedRef.current.y;
          diceRef.current.rotation.z += rotationSpeedRef.current.z;
        }

        renderer.render(scene, camera);
        gl.endFrameEXP();
      };
      render();
    } catch (error) {
      console.error('Error loading 3D model:', error);
    }
  };

  // Orientar el dado según el valor (1-6)
  const orientDiceToValue = (val: number) => {
    if (!diceRef.current) return;

    // Rotaciones para mostrar cada cara del dado
    // Ajusta estos valores según cómo esté orientado tu modelo
    const rotations: Record<number, [number, number, number]> = {
      1: [0, 0, 0],
      2: [0, Math.PI / 2, 0],
      3: [0, Math.PI, 0],
      4: [0, -Math.PI / 2, 0],
      5: [Math.PI / 2, 0, 0],
      6: [-Math.PI / 2, 0, 0],
    };

    const [targetX, targetY, targetZ] = rotations[val] || rotations[1];
    
    // Animación suave hacia la rotación objetivo
    const steps = 30;
    const currentRotation = {
      x: diceRef.current.rotation.x,
      y: diceRef.current.rotation.y,
      z: diceRef.current.rotation.z,
    };
    
    for (let i = 0; i <= steps; i++) {
      setTimeout(() => {
        if (diceRef.current) {
          const progress = i / steps;
          const easing = 1 - Math.pow(1 - progress, 3); // Ease out cubic
          
          diceRef.current.rotation.x = currentRotation.x + (targetX - currentRotation.x) * easing;
          diceRef.current.rotation.y = currentRotation.y + (targetY - currentRotation.y) * easing;
          diceRef.current.rotation.z = currentRotation.z + (targetZ - currentRotation.z) * easing;
        }
      }, i * 16);
    }
  };

  // Efecto para controlar la rotación
  useEffect(() => {
    if (isRolling) {
      // Rotación rápida y caótica al lanzar
      rotationSpeedRef.current = {
        x: 0.15 + Math.random() * 0.1,
        y: 0.2 + Math.random() * 0.1,
        z: 0.1 + Math.random() * 0.1,
      };

      // Detener y orientar después de 600ms
      const timeout = setTimeout(() => {
        rotationSpeedRef.current = { x: 0, y: 0, z: 0 };
        orientDiceToValue(value);
      }, 600);

      return () => clearTimeout(timeout);
    } else {
      // Rotación muy lenta cuando está en reposo
      rotationSpeedRef.current = {
        x: 0.003,
        y: 0.005,
        z: 0,
      };
    }
  }, [isRolling, value]);

  // Cleanup
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
    width: 250,
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  glView: {
    flex: 1,
  },
});