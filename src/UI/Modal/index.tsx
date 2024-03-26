import { useState } from "react"
import { createPortal } from "react-dom";

export const ModalPortal = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button>show modal</button>
            {showModal && createPortal(
                <div>
                    modal content
                </div>,
                document.body
            )}
        </>
    )
}