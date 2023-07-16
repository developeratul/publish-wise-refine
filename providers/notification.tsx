import { NotificationProvider } from "@refinedev/core";
import { toast } from "react-hot-toast";

const notificationProvider: NotificationProvider = {
  open: ({ message, type, key }) => {
    if (type === "success") {
      toast.success(message, { id: key });
    } else if (type === "progress") {
      toast.loading(message, { id: key });
    } else if (type === "error") {
      toast.error(message, { id: key });
    }
  },
  close: (toastId) => toast.dismiss(toastId),
};

export default notificationProvider;
