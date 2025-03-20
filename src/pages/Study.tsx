import React, { useState, useEffect } from 'react';
import StudyModal from '@/components/StudyModal';

const Study = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <div className="container mx-auto h-screen flex items-center justify-center">
      <h1>Study Session</h1>
      <p>This is the study session page.</p>
      <StudyModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default Study;
