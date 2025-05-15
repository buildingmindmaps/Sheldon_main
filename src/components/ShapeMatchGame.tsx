
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type ShapeType = 'cube' | 'sphere' | 'cone' | 'cylinder' | 'torus';

interface Shape {
  type: ShapeType;
  mesh?: THREE.Mesh;
  position: THREE.Vector3;
  color: string;
  matched: boolean;
}

interface Target {
  type: ShapeType;
  mesh?: THREE.Mesh;
  position: THREE.Vector3;
  color: string;
  filled: boolean;
}

const SHAPE_TYPES: ShapeType[] = ['cube', 'sphere', 'cone', 'cylinder', 'torus'];
const COLORS = ['#33C3F0', '#9b87f5', '#7E69AB', '#F97316', '#84FF01'];

export function ShapeMatchGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const shapesRef = useRef<Shape[]>([]);
  const targetsRef = useRef<Target[]>([]);
  const draggingRef = useRef<Shape | null>(null);
  const mousePositionRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const gameStartedRef = useRef<boolean>(false);
  const gameLevelRef = useRef<number>(1);
  const [gameState, setGameState] = useState<'playing' | 'levelComplete' | 'gameOver'>('playing');
  const [score, setScore] = useState<number>(0);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f8f8);
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Initialize game
    initGame();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Gently rotate all shapes for visual appeal
      shapesRef.current.forEach(shape => {
        if (shape.mesh && shape !== draggingRef.current && !shape.matched) {
          shape.mesh.rotation.y += 0.005;
          shape.mesh.rotation.x += 0.002;
        }
      });

      // Make targets pulsate slightly to draw attention
      targetsRef.current.forEach(target => {
        if (target.mesh && !target.filled) {
          const pulseFactor = Math.sin(Date.now() * 0.002) * 0.05 + 0.95;
          target.mesh.scale.set(pulseFactor, pulseFactor, pulseFactor);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // Event listeners for mouse/touch interaction
    const onMouseDown = (event: MouseEvent) => handleMouseDown(event);
    const onMouseMove = (event: MouseEvent) => handleMouseMove(event);
    const onMouseUp = () => handleMouseUp();
    
    // Add event listeners
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    
    // Touch events
    renderer.domElement.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleMouseDown({
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
        preventDefault: () => {}
      } as MouseEvent);
    });
    
    renderer.domElement.addEventListener('touchmove', (e) => {
      e.preventDefault();
      handleMouseMove({
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
        preventDefault: () => {}
      } as MouseEvent);
    });
    
    renderer.domElement.addEventListener('touchend', () => {
      handleMouseUp();
    });

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Initialize or reset game state
  const initGame = () => {
    if (!sceneRef.current) return;
    
    // Clear existing shapes and targets
    shapesRef.current.forEach(shape => {
      if (shape.mesh) sceneRef.current?.remove(shape.mesh);
    });
    targetsRef.current.forEach(target => {
      if (target.mesh) sceneRef.current?.remove(target.mesh);
    });
    
    shapesRef.current = [];
    targetsRef.current = [];
    
    // Determine number of shapes based on level
    const numShapes = Math.min(3 + gameLevelRef.current, SHAPE_TYPES.length);
    
    // Create unique set of shape types for this level
    const levelShapeTypes: ShapeType[] = [];
    const availableShapeTypes = [...SHAPE_TYPES];
    
    for (let i = 0; i < numShapes; i++) {
      const randomIndex = Math.floor(Math.random() * availableShapeTypes.length);
      levelShapeTypes.push(availableShapeTypes[randomIndex]);
      availableShapeTypes.splice(randomIndex, 1);
    }
    
    // Create target outlines (destination shapes)
    for (let i = 0; i < numShapes; i++) {
      const shapeType = levelShapeTypes[i];
      const x = (i - (numShapes - 1) / 2) * 3; // Spread targets evenly
      
      const target: Target = {
        type: shapeType,
        position: new THREE.Vector3(x, -2, 0), // Position targets at bottom
        color: COLORS[i % COLORS.length],
        filled: false
      };
      
      // Create semi-transparent target mesh
      target.mesh = createMesh(shapeType, target.color, 0.3); // Transparent
      target.mesh.position.copy(target.position);
      target.mesh.scale.set(1.2, 1.2, 1.2); // Slightly larger to make it easier to target
      
      if (sceneRef.current) {
        sceneRef.current.add(target.mesh);
      }
      
      targetsRef.current.push(target);
    }
    
    // Create draggable shapes (shuffled)
    const shuffledTypes = [...levelShapeTypes].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numShapes; i++) {
      const shapeType = shuffledTypes[i];
      const x = (i - (numShapes - 1) / 2) * 3;
      
      // Find matching color for this shape type
      const matchingTargetIndex = levelShapeTypes.findIndex(type => type === shapeType);
      const color = COLORS[matchingTargetIndex % COLORS.length];
      
      const shape: Shape = {
        type: shapeType,
        position: new THREE.Vector3(x, 2, 0), // Position shapes at top
        color: color,
        matched: false
      };
      
      // Create solid shape mesh
      shape.mesh = createMesh(shapeType, color);
      shape.mesh.position.copy(shape.position);
      
      if (sceneRef.current) {
        sceneRef.current.add(shape.mesh);
      }
      
      shapesRef.current.push(shape);
    }
    
    gameStartedRef.current = true;
    setGameState('playing');
  };

  // Create mesh for a given shape type
  const createMesh = (type: ShapeType, color: string, opacity = 1) => {
    let geometry: THREE.BufferGeometry;
    
    // Create geometry based on shape type
    switch (type) {
      case 'cube':
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(0.6, 32, 32);
        break;
      case 'cone':
        geometry = new THREE.ConeGeometry(0.6, 1.2, 32);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 32);
        break;
    }
    
    // Material with specified color and opacity
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      transparent: opacity < 1,
      opacity: opacity,
      shininess: 50
    });
    
    return new THREE.Mesh(geometry, material);
  };

  // Convert screen coordinates to normalized device coordinates
  const getNormalizedMousePosition = (event: MouseEvent) => {
    if (!containerRef.current) return new THREE.Vector2();
    
    const rect = containerRef.current.getBoundingClientRect();
    return new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
  };

  // Handle mouse down - check if a shape was clicked
  const handleMouseDown = (event: MouseEvent) => {
    if (gameState !== 'playing' || !sceneRef.current || !cameraRef.current) return;
    
    const mousePos = getNormalizedMousePosition(event);
    mousePositionRef.current = mousePos;
    
    // Update the raycaster with the mouse position and camera
    raycasterRef.current.setFromCamera(mousePos, cameraRef.current);
    
    // Check for intersections with shapes
    const intersects = raycasterRef.current.intersectObjects(
      shapesRef.current
        .filter(shape => !shape.matched && shape.mesh)
        .map(shape => shape.mesh!)
    );
    
    // If we intersected with a shape, start dragging it
    if (intersects.length > 0) {
      const selectedMesh = intersects[0].object as THREE.Mesh;
      const selectedShape = shapesRef.current.find(shape => shape.mesh === selectedMesh);
      
      if (selectedShape) {
        draggingRef.current = selectedShape;
        
        // Make the selected shape appear slightly above others
        if (selectedShape.mesh) {
          selectedShape.mesh.position.z = 1;
        }
      }
    }
  };

  // Handle mouse move - update position of dragged shape
  const handleMouseMove = (event: MouseEvent) => {
    if (!draggingRef.current || !draggingRef.current.mesh || !cameraRef.current || !sceneRef.current) return;
    
    const mousePos = getNormalizedMousePosition(event);
    mousePositionRef.current = mousePos;
    
    // Project mouse position to 3D space
    const vector = new THREE.Vector3(mousePos.x, mousePos.y, 0);
    vector.unproject(cameraRef.current);
    
    const dir = vector.sub(cameraRef.current.position).normalize();
    const distance = -cameraRef.current.position.z / dir.z;
    const pos = cameraRef.current.position.clone().add(dir.multiplyScalar(distance));
    
    // Update the position of the dragged shape
    draggingRef.current.mesh.position.x = pos.x;
    draggingRef.current.mesh.position.y = pos.y;
    draggingRef.current.position.x = pos.x;
    draggingRef.current.position.y = pos.y;
  };

  // Handle mouse up - check if the shape was dropped on a matching target
  const handleMouseUp = () => {
    if (!draggingRef.current || !draggingRef.current.mesh || gameState !== 'playing') {
      draggingRef.current = null;
      return;
    }
    
    const draggedShape = draggingRef.current;
    
    // Find closest target
    let closestTarget: Target | null = null;
    let minDistance = Number.MAX_VALUE;
    
    targetsRef.current.forEach(target => {
      if (!target.filled && target.type === draggedShape.type) {
        const distance = target.position.distanceTo(draggedShape.position);
        if (distance < minDistance) {
          minDistance = distance;
          closestTarget = target;
        }
      }
    });
    
    // If we're close enough to a matching target, snap to it
    if (closestTarget && minDistance < 2) {
      // Snap shape to target
      draggedShape.position.copy(closestTarget.position);
      if (draggedShape.mesh) {
        draggedShape.mesh.position.copy(closestTarget.position);
        
        // Animate successful match
        const originalScale = { value: 1 };
        const targetScale = { value: 1.3 };
        
        // Simple scale animation
        const animate = () => {
          originalScale.value += (targetScale.value - originalScale.value) * 0.1;
          
          if (draggedShape.mesh) {
            draggedShape.mesh.scale.set(
              originalScale.value,
              originalScale.value,
              originalScale.value
            );
          }
          
          if (originalScale.value < 1.29) {
            requestAnimationFrame(animate);
          } else {
            // Shrink back down
            const shrink = () => {
              originalScale.value += (1 - originalScale.value) * 0.1;
              
              if (draggedShape.mesh) {
                draggedShape.mesh.scale.set(
                  originalScale.value,
                  originalScale.value,
                  originalScale.value
                );
              }
              
              if (originalScale.value > 1.01) {
                requestAnimationFrame(shrink);
              }
            };
            
            shrink();
          }
        };
        
        animate();
        
        // Provide haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }
        
        // Mark as matched
        draggedShape.matched = true;
        closestTarget.filled = true;
        
        // Update score
        setScore(prevScore => prevScore + 100);
        
        // Check if level is complete
        const allMatched = shapesRef.current.every(shape => shape.matched);
        
        if (allMatched) {
          // Level complete!
          setGameState('levelComplete');
          
          // Advance to next level after delay
          setTimeout(() => {
            gameLevelRef.current += 1;
            initGame();
          }, 2000);
        }
      }
    } else {
      // Not matched, return to original position
      draggedShape.position.z = 0;
      if (draggedShape.mesh) {
        draggedShape.mesh.position.z = 0;
      }
    }
    
    // Release dragged shape
    draggingRef.current = null;
  };

  // UI overlay to show game status
  const renderGameUI = () => {
    switch (gameState) {
      case 'playing':
        return (
          <div className="absolute top-2 left-2 right-2 flex justify-between items-center text-sm text-gray-600">
            <div>Level: {gameLevelRef.current}</div>
            <div>Score: {score}</div>
          </div>
        );
      case 'levelComplete':
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white p-4 rounded-lg shadow-lg text-center">
              <h3 className="text-lg font-bold">Level Complete!</h3>
              <p>Advancing to level {gameLevelRef.current + 1}...</p>
            </div>
          </div>
        );
      case 'gameOver':
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white p-4 rounded-lg shadow-lg text-center">
              <h3 className="text-lg font-bold">Game Over</h3>
              <p>Final Score: {score}</p>
              <button
                className="mt-2 px-4 py-2 bg-brand-green text-white rounded hover:bg-opacity-80"
                onClick={() => {
                  gameLevelRef.current = 1;
                  setScore(0);
                  initGame();
                }}
              >
                Play Again
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {renderGameUI()}
    </div>
  );
}
