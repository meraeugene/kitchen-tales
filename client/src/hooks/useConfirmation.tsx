// useConfirmation.ts
import { useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";

const useConfirmation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [resolve, setResolve] = useState<
    (value: boolean | PromiseLike<boolean>) => void
  >(() => () => {});
  const [message, setMessage] = useState<string>("");

  const open = (message: string) => {
    setMessage(message);
    setIsVisible(true);
    return new Promise<boolean>((res) => {
      setResolve(() => res);
    });
  };

  const close = () => {
    setIsVisible(false);
  };

  const handleConfirm = () => {
    resolve(true);
    close();
  };

  const handleCancel = () => {
    resolve(false);
    close();
  };

  const modal = isVisible ? (
    <ConfirmationModal
      message={message}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return { modal, open };
};

export default useConfirmation;
