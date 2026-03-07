import { createContext, useContext, useState } from "react";
import { Portal, Snackbar } from "react-native-paper";

type SnackbarType = "success" | "error" | "info";

interface SnackbarContextProps {
  showSnackbar: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextProps>({
  showSnackbar: () => {},
});

export function SnackbarProvider({ children }: any) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<SnackbarType>("info");

  const showSnackbar = (msg: string, snackbarType: SnackbarType = "info") => {
    setMessage(msg);
    setType(snackbarType);
    setVisible(true);
  };

  const getColor = () => {
    switch (type) {
      case "success":
        return "#2e7d32";
      case "error":
        return "#B00020";
      default:
        return "#333";
    }
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <Portal>
        <Snackbar
          visible={visible}
          onDismiss={() => setVisible(false)}
          duration={2500}
          style={{
            margin: 0,
            borderRadius: 0,
            backgroundColor: getColor(),
          }}
        >
          {message}
        </Snackbar>
      </Portal>
    </SnackbarContext.Provider>
  );
}

export const useSnackbar = () => useContext(SnackbarContext);
