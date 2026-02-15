import { toast } from "react-toastify";

export const showSuccess = (msg) => {
  toast.success(msg, {
    position: "top-center",
    autoClose: 3000,
    style: {
      backgroundColor: "green",
      color: "white",
      fontWeight: "bold",
    },
  });
};

export const showError = (msg) => {
  toast.error(msg, {
    position: "top-center",
    autoClose: 3000,
    style: {
      backgroundColor: "red",
      color: "white",
      fontWeight: "bold",
    },
  });
};

export const showInfo = (msg) => {
  toast.info(msg, {
    position: "top-center",
    autoClose: 3000,
    style: {
      backgroundColor: "blue",
      color: "white",
      fontWeight: "bold",
    },
  });
};
