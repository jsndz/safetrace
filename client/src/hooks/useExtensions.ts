import { useState, useCallback } from "react";
import {
  Extension,
  ExtensionConfig,
  ExtensionState,
  EXTENSION_DEFINITIONS,
} from "../types/extensions";
import { useAuth } from "./useAuth";
import axios from "axios";

export const useExtensions = () => {
  const { user } = useAuth();

  const [state, setState] = useState<ExtensionState>(() => {
    const extensions = EXTENSION_DEFINITIONS.map((def) => ({
      ...def,
      enabled: false,
      config: undefined,
    }));

    return {
      extensions,
      activeConfigExtension: null,
    };
  });

  const toggleExtension = useCallback(
    async (extensionId: string) => {
      setState((prev) => ({
        ...prev,
        extensions: prev.extensions.map((ext) =>
          ext.id === extensionId ? { ...ext, enabled: !ext.enabled } : ext
        ),
      }));
    },
    [state.extensions, user?.ID]
  );

  const openConfigModal = useCallback((extension: Extension) => {
    setState((prev) => ({
      ...prev,
      activeConfigExtension: extension,
    }));
  }, []);

  const closeConfigModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeConfigExtension: null,
    }));
  }, []);

  const saveExtensionConfig = useCallback(
    async (extensionId: string, config: ExtensionConfig) => {
      try {
        console.log(config);

        const link = EXTENSION_DEFINITIONS.find(
          (ex) => ex.id == extensionId
        )?.link;

        const response = await axios.post(
          `${link}/${user?.ID}`,
          config,
          {
            withCredentials: true,
          }
        );

        if (!response) {
          throw new Error("Failed to save configuration");
        }

        // Update local state
        setState((prev) => ({
          ...prev,
          extensions: prev.extensions.map((ext) =>
            ext.id === extensionId ? { ...ext, config, enabled: true } : ext
          ),
          activeConfigExtension: null,
        }));

        return { success: true };
      } catch (error) {
        console.error("Failed to save extension config:", error);
        return { success: false, error: "Failed to save configuration" };
      }
    },
    [user?.ID]
  );

  const getExtensionById = useCallback(
    (id: string) => {
      return state.extensions.find((ext) => ext.id === id);
    },
    [state.extensions]
  );

  const getEnabledExtensions = useCallback(() => {
    return state.extensions.filter((ext) => ext.enabled);
  }, [state.extensions]);

  return {
    extensions: state.extensions,
    activeConfigExtension: state.activeConfigExtension,
    toggleExtension,
    openConfigModal,
    closeConfigModal,
    saveExtensionConfig,
    getExtensionById,
    getEnabledExtensions,
  };
};
