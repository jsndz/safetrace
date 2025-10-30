// const API_BASE = import.meta.env.VITE_CLIENT_API;
const API_BASE =
  import.meta.env.VITE_CLIENT_API || "http://localhost:8080/api/v1";
export interface ExtensionConfig {
  [key: string]: any;
}

export interface Extension {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  requiresConfig: boolean;
  config?: ExtensionConfig;
  configSchema?: ExtensionConfigField[];
  link?: string;
}

export interface ExtensionConfigField {
  key: string;
  label: string;
  type: "text" | "number" | "email" | "password" | "select" | "checkbox";
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  validation?: (value: any) => string | null;
}

export interface ExtensionState {
  extensions: Extension[];
  activeConfigExtension: Extension | null;
}

export const EXTENSION_DEFINITIONS: Omit<Extension, "enabled" | "config">[] = [
  {
    id: "geo-fencer",
    name: "Geo-Fencer",
    description:
      "Set up virtual boundaries and get alerts when entering or leaving specific areas",
    icon: "MapPin",
    link: `${API_BASE}/fencer`,
    requiresConfig: true,
    configSchema: [
      {
        key: "name",
        label: "Fence Name",
        type: "text",
        required: true,
        placeholder: "e.g., Home, Office, School",
      },
      {
        key: "latitude",
        label: "Latitude",
        type: "number",
        required: true,
        placeholder: "40.7128",
        step: 0.000001,
        validation: (value) => {
          const num = parseFloat(value);
          if (isNaN(num) || num < -90 || num > 90) {
            return "Latitude must be between -90 and 90";
          }
          return null;
        },
      },
      {
        key: "longitude",
        label: "Longitude",
        type: "number",
        required: true,
        placeholder: "-74.0060",
        step: 0.000001,
        validation: (value) => {
          const num = parseFloat(value);
          if (isNaN(num) || num < -180 || num > 180) {
            return "Longitude must be between -180 and 180";
          }
          return null;
        },
      },
      {
        key: "radius",
        label: "Radius (meters)",
        type: "number",
        required: true,
        placeholder: "100",
        min: 10,
        max: 10000,
        step: 10,
        validation: (value) => {
          const num = parseFloat(value);
          if (isNaN(num) || num < 10 || num > 10000) {
            return "Radius must be between 10 and 10,000 meters";
          }
          return null;
        },
      },
      {
        key: "alertType",
        label: "Alert Type",
        type: "select",
        required: true,
        options: [
          { value: "enter", label: "Alert when entering" },
          { value: "exit", label: "Alert when leaving" },
          { value: "both", label: "Alert for both" },
        ],
      },
    ],
  },
  {
    id: "logger",
    name: "Activity Logger",
    description:
      "Automatically log location updates with detailed timestamps and metadata",
    icon: "FileText",
    requiresConfig: false,
  },
  {
    id: "speed-monitor",
    name: "Speed Monitor",
    description:
      "Track movement speed and get alerts for speeding or unusual patterns",
    icon: "Gauge",
    requiresConfig: true,
    configSchema: [
      {
        key: "maxSpeed",
        label: "Maximum Speed (km/h)",
        type: "number",
        required: true,
        placeholder: "80",
        min: 1,
        max: 300,
        step: 1,
      },
      {
        key: "alertEnabled",
        label: "Enable Speed Alerts",
        type: "checkbox",
        required: false,
      },
    ],
  },
  {
    id: "battery-saver",
    name: "Battery Saver",
    description:
      "Optimize tracking frequency based on movement patterns to save battery",
    icon: "Battery",
    requiresConfig: true,
    configSchema: [
      {
        key: "mode",
        label: "Power Saving Mode",
        type: "select",
        required: true,
        options: [
          { value: "low", label: "Low (update every 5 minutes)" },
          { value: "medium", label: "Medium (update every 2 minutes)" },
          { value: "high", label: "High (update every 30 seconds)" },
        ],
      },
      {
        key: "autoAdjust",
        label: "Auto-adjust based on movement",
        type: "checkbox",
        required: false,
      },
    ],
  },
];
