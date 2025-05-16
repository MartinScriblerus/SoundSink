// Modal.tsx
import React from "react";
import ReactDOM from "react-dom";

const modalRoot = document.getElementById("modal-root")!;

export const PortalCenterModal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        display: "flex", justifyContent: "center", alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 99999,
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white",
          padding: "0",
          borderRadius: "8px",
          zIndex: 99999,
        }}
      >
        {children}
      </div>
    </div>,
    modalRoot
  );
};