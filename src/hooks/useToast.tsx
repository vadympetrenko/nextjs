import { Theme, ToastPosition, TypeOptions, toast as originToast } from "react-toastify";
type toastType = {
  (
    message: string,
    type: TypeOptions,
    options?: {
      position: ToastPosition;
      theme: Theme;
    }
  ): void;
};

export const toast: toastType = (message, type, options) => {
  const toastOptions = {
    position: options?.position || "top-center",
    autoClose: 850,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: 1,
    theme: options?.theme || "colored",
  };

  const addOptions = options ? toastOptions : {}
  return type === 'default' ? originToast(message, addOptions): originToast[type](message, addOptions);
};
