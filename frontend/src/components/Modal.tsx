import React, { useEffect, useCallback } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backdropClosable?: boolean;
};

export const Modal = ({ isOpen, onClose, children, backdropClosable = true }: ModalProps) => {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, handleKey]);

  if (!isOpen) return null;
  return (
    <div
      onClick={() => backdropClosable && onClose()}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
    >
      <div
  onClick={(event) => event.stopPropagation()}
        className="relative"
      >
        {children}
      </div>
    </div>
  );
};
