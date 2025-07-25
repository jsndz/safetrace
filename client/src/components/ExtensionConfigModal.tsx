import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import {
  Extension,
  ExtensionConfig,
  ExtensionConfigField,
} from "../types/extensions";
import { GlassCard } from "./GlassCard";

interface ExtensionConfigModalProps {
  extension: Extension | null;
  onSave: (
    extensionId: string,
    config: ExtensionConfig
  ) => Promise<{ success: boolean; error?: string }>;
  onClose: () => void;
}

export const ExtensionConfigModal: React.FC<ExtensionConfigModalProps> = ({
  extension,
  onSave,
  onClose,
}) => {
  const [config, setConfig] = useState<ExtensionConfig>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (extension) {
      // Initialize config with existing values or defaults
      const initialConfig: ExtensionConfig = {};
      extension.configSchema?.forEach((field) => {
        if (extension.config && extension.config[field.key] !== undefined) {
          initialConfig[field.key] = extension.config[field.key];
        } else if (field.type === "checkbox") {
          initialConfig[field.key] = false;
        } else {
          initialConfig[field.key] = "";
        }
      });
      setConfig(initialConfig);
      setErrors({});
    }
  }, [extension]);

  if (!extension) return null;

  const handleInputChange = (field: ExtensionConfigField, value: any) => {
    let parsedValue = value;
    if (field.type == "number") {
      parsedValue = value === "" ? "" : Number(value);
    }
    setConfig((prev) => ({ ...prev, [field.key]: parsedValue }));

    // Clear error when user starts typing
    if (errors[field.key]) {
      setErrors((prev) => ({ ...prev, [field.key]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    extension.configSchema?.forEach((field) => {
      const value = config[field.key];

      // Required field validation
      if (field.required && (!value || value === "")) {
        newErrors[field.key] = `${field.label} is required`;
        return;
      }

      // Custom validation
      if (field.validation && value) {
        const error = field.validation(value);
        if (error) {
          newErrors[field.key] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await onSave(extension.id, config);
      if (result.success) {
        onClose();
      } else {
        setErrors({ general: result.error || "Failed to save configuration" });
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field: ExtensionConfigField) => {
    const value = config[field.key] || "";
    const error = errors[field.key];

    switch (field.type) {
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition-colors ${
              error ? "border-red-500/50" : "border-slate-600/50"
            }`}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleInputChange(field, e.target.checked)}
              className="w-4 h-4 text-sky-500 bg-slate-700 border-slate-600 rounded focus:ring-sky-500 focus:ring-2"
            />
            <span className="text-sm text-slate-300">{field.label}</span>
          </label>
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition-colors ${
              error ? "border-red-500/50" : "border-slate-600/50"
            }`}
          />
        );

      default:
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition-colors ${
              error ? "border-red-500/50" : "border-slate-600/50"
            }`}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GlassCard>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                Configure {extension.name}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {extension.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {extension.configSchema?.map((field) => (
              <div key={field.key}>
                {field.type !== "checkbox" && (
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {field.label}
                    {field.required && (
                      <span className="text-red-400 ml-1">*</span>
                    )}
                  </label>
                )}

                {renderField(field)}

                {errors[field.key] && (
                  <div className="flex items-center gap-2 mt-1 text-red-400 text-sm">
                    <AlertCircle size={14} />
                    <span>{errors[field.key]}</span>
                  </div>
                )}
              </div>
            ))}

            {/* General Error */}
            {errors.general && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  <span>{errors.general}</span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 py-2 px-4 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500/50 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Configuration
                </>
              )}
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
