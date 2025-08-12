// Sample.tsx
import React from 'react';
import { useRive } from '@rive-app/react-canvas';

const Sample = () => {
  const { RiveComponent } = useRive({
    src: '/assets/images/animat.riv',
    autoplay: true,
  });

  return (
    <div style={{ width: 300, height: 300 }}>
      <RiveComponent />
    </div>
  );
};

export default Sample;
