import { Button } from '@/UI/Button';
import { useModalType } from '@/hooks/useModal';
import { PropsWithChildren } from 'react';
import ReactDOM from 'react-dom';
type modalType = {
    className?: string,
    modal: useModalType,
    primaryAction: {
        buttonText: string,
        action: () => void
    }
    disabledAction?: boolean
}

const Modal:React.FC<PropsWithChildren<modalType>> = ({modal: [isShowingModal, toggleModal], children, primaryAction, className, disabledAction = true}) => {
  if (!isShowingModal) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className={`modal-wrapper`}>
      <div className={`modal ${className ? className : ''}`}>
        <div className="body">
          {children}
        </div>
        <div className="footer">
          <Button onClick={toggleModal} variation='primary'>Close Modal</Button>
          <Button onClick={primaryAction.action} disabled={!disabledAction}   variation='tertiary'>{primaryAction.buttonText}</Button>
        </div>
      </div>
    </div>
    , document.body
  );
};

export default Modal;
