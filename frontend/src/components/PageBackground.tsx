"use client";

import LightPillar from "./LightPillar";

export default function PageBackground() {
  return (
    <div className="absolute inset-0">
      <LightPillar
        topColor="#8B5CF6"
        bottomColor="#EC4899"
        intensity={1.1}
        rotationSpeed={0.7}
        glowAmount={0.003}
        pillarWidth={6.4}
        pillarHeight={0.4}
        noiseIntensity={1.2}
        pillarRotation={228}
      />
    </div>
  );
}

