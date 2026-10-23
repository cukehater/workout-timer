import { useEffect, useRef, type ReactNode } from 'react';

type Props = {
  open: boolean;
  title: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
};

/**
 * 네이티브 <dialog>를 쓴다. 포커스 트랩, ESC 닫기, 배경 inert 처리,
 * aria-modal이 전부 브라우저 기본 동작이라 직접 만들 게 없다.
 */
export function Modal({ open, title, confirmLabel, onConfirm, onCancel, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal"
      // ESC로 닫힐 때도 React 상태를 맞춰준다
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
    >
      <h2 className="modal__title">{title}</h2>
      {children && <p className="modal__body">{children}</p>}
      <div className="modal__actions">
        <button type="button" className="btn" onClick={onCancel}>
          취소
        </button>
        <button type="button" className="btn btn--danger" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
