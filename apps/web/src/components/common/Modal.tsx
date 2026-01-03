import React from "react";

export const Modal: React.FC<
  React.PropsWithChildren<{
    onRequestClose?: () => void;
    modalClassName?: string;
  }>
> = ({ children, onRequestClose, modalClassName }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onRequestClose?.();
      }}
    >
      <div
        className={`p-6 flex flex-col bg-gray-800 rounded-lg shadow-lg ${
          modalClassName ?? ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export const ModalHeader: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  return <div className="ml-8 mb-4">{children}</div>;
};

export const ModalBody: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  return <div className="m-4">{children}</div>;
};

export const ModalFooter: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  return (
    <div className="flex flex-row align-center justify-end">{children}</div>
  );
};
