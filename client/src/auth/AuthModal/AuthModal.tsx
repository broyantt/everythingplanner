import styles from "./AuthModal.module.css";

type AuthModalProps = {
  onClose: () => void;
};

export default function AuthModal({ onClose }: AuthModalProps) {
  return (
    <div onClick={onClose} className={styles.overlayModal}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={styles.modal}
      >
        test
      </div>
    </div>
  );
}
