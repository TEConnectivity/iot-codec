export enum SensorFamily {
  Singlepoint = "SP",
  Multipoint = "MP"
}

export interface Characteristic {
  uuid: string,
  charac_name: string,
  payload_size: string,
  ble: string,
  lora: string,
  type: CharacType,
}

export enum Operation {
  READ = "r",
  READWRITE = "wr",
  WRITE = "w"
}

export enum CharacType {
  // COMMON
  APP_EUI = "app_eui",
  BATTERY = "battery",
  BATTERY_DIAGNOSIS = "battery_diagnosis",
  BLE_ACTIVATION = "ble_activation",
  COMMUNICATION_DIAGNOSIS = "communication_diagnosis",
  DEV_EUI = "dev_eui",
  DEVICE_STATUS = "device_status",
  FIRMWARE_RESOLUTION = "firmware_resolution",
  HARDWARE_REVISION = "hardware_revision",
  INTERNAL_TEMPERATURE = "internal_temperature",
  KEEPALIVE = "keepalive",
  LAST_DATA_ACQUIRED = "last_data_acquired",
  LORA_MODE = "lora_mode",
  LORA_PERCENTAGE = "lora_percentage",
  LORA_STATUS = "lora_status",
  MANUFACTURER = "manufacturer",
  MEAS_COUNTER = "meas_counter",
  MEAS_INTERVAL = "meas_interval",
  MODEL_NUMBER = "model_number",
  NET_ID = "net_id",
  REGION = "region",
  SENSOR_DIAGNOSIS = "sensor_diagnosis",
  SERIAL_NUMBER = "serial_number",
  THRESHOLD = "threshold",
  //SP
  DATALOG_ANALYSIS = "datalog_analysis",
  DATALOG_DATA = "datalog_data",
  // MP
  // PRESET = "preset"
  AXIS_SELECTION = "axis_selection",
  PRESET_SELECTION = "preset_selection",
  WINDOWING_FUNCTION = "windowing_function",
  PRESET_CONFIGURATION = "preset_configuration",
  PRESET_REQUEST = "preset_request",
  WINDOW_CONFIGURATION = "window_configuration",
  WINDOW_REQUEST = "window_request",
  MULTIPOINT_THRESHOLD = "multipoint_threshold",
  MULTIPOINT_THRESHOLD_REQUEST = "multipoint_threshold_request",

}

// ---------------------
//  SCHEMAS FOR USER PAYLOAD
// ---------------------

/**
 * MeasInterval is only WRITEABLE for Singlepoint. For Vibration please use Preset Configuration.
 */
export interface MeasIntervalType {
  type: CharacType.MEAS_INTERVAL
  hour: string,
  minute: string,
  second: string
}

export interface BLEActivationType {
  type: CharacType.BLE_ACTIVATION
  checked: boolean
}

/**
 * This schema is compliant with both SP & MP threshold. 
 * 
 * DATA32 is a four byte array. Check related specification.
 */
export interface ThresholdType {
  type: CharacType.THRESHOLD
  id_data: string,
  param_sel: string,
  data32: string
}

export interface BatteryType {
  type: CharacType.BATTERY
  reset: boolean,
}

export interface KeepaliveType {
  type: CharacType.KEEPALIVE
  keepaliveInterval: string,
  keepaliveMode: string,
}


export interface LoramodeType {
  type: CharacType.LORA_MODE
  mode: number
}

export interface LorapercentageType {
  type: CharacType.LORA_PERCENTAGE
  percentage: number
}

// Type used when payload is set to {} because frame is read operation (no payload)
export interface EmptyObject {
  type: "empty"
}


// SINGLEPOINT

/**
 * Only available on singlepoint.
 */
export interface DatalogArrayType {
  type: CharacType.DATALOG_DATA
  datalog_type: number,
  index: number,
  length: number
}

/**
 * Only available on singlepoint.
 */
export interface DatalogAnalysisType {
  type: CharacType.DATALOG_ANALYSIS
  length: number
}



// MULTIPOINT 


export interface AxisSelectionType {
  type: CharacType.AXIS_SELECTION
  axis_selected: ("x" | "y" | "z")[]
}

/**
 * If secondary_preset is present, rotating mode will be enabled
 */
export interface PresetSelectionType {
  type: CharacType.PRESET_SELECTION
  main_preset: number,
  secondary_preset?: number
}

export interface WindowingFunctionType {
  type: CharacType.WINDOWING_FUNCTION
  function: "hann" | "flattop" | "none"
}


/**
 * This frame configure a preset.
 */
export interface PresetConfigurationType {
  type?: CharacType.PRESET_CONFIGURATION
  preset_id: number,
  frame_format: 0 | 1 | 2,
  bandwidth_mode: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
  meas_interval_hour: number,
  meas_interval_minute: number,
  meas_interval_second: number
}

/**
 * Send this frame to request the configuration of a given preset.
 */
export interface PresetRequestType {
  type?: CharacType.PRESET_REQUEST
  preset_id: number,
}


export interface WindowConfigurationType {
  type?: CharacType.WINDOW_CONFIGURATION
  preset_id: number,
  window_id: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
  enable: boolean,
  /**
   * Shall be between 0 and 64
   */
  peak_count: number
  /**
   * Shall be between 0 and 20k
   */
  frequency_min: number,
  /**
   * Shall be between 0 and 20k
   */
  frequency_max: number
}

export interface WindowRequestType {
  type?: CharacType.WINDOW_REQUEST
  preset_id: number,
  window_id: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
}

/**
 * Threshold is a highly dynamic frame. Refer to documentation for more info.
 */
interface MultipointThreshold {
  type?: CharacType.MULTIPOINT_THRESHOLD
  id_data: Multipoint_Threshold_ID_DATA
}

export interface MultipointThresholdConfigType extends MultipointThreshold {
  param_sel: "ths_config"
  event_flag: boolean,
  enabled: boolean,
  direction: "above" | "below",
  auto_clear: boolean
  set_ble_mode: boolean,
  set_lora_mode: boolean,
}

export interface MultipointThresholdLevelType extends MultipointThreshold {
  param_sel: "ths_level"

  /**
   * Four-byte number containing Float32. May be mg or °C, if the selected threshold is vibration or temperature.
   */
  level: number
}

export interface MultipointThresholdCommModeType extends MultipointThreshold {
  param_sel: "communication_mode";
  ble_mode: "burst+periodic" | "burst" | "silent" | "periodic"
  lora_mode: "on_measurement"
}

export interface MultipointThresholdRequestType {
  type?: CharacType.MULTIPOINT_THRESHOLD_REQUEST
  id_data: Multipoint_Threshold_ID_DATA
  param_sel: "ths_config" | "ths_level" | "communication_mode"
}

export type UserPayloadType = MeasIntervalType |
  BLEActivationType |
  EmptyObject |
  ThresholdType |
  BatteryType |
  KeepaliveType |
  DatalogArrayType |
  DatalogAnalysisType |
  LoramodeType |
  LorapercentageType |
  AxisSelectionType |
  PresetSelectionType |
  WindowingFunctionType |
  PresetConfigurationType |
  PresetRequestType |
  WindowConfigurationType |
  WindowRequestType |
  MultipointThresholdConfigType |
  MultipointThresholdLevelType |
  MultipointThresholdCommModeType |
  MultipointThresholdRequestType









type CharacMap = {
  [key in CharacType]: Characteristic;
}



export const Charac_DB: CharacMap = {
  model_number: {
    uuid: "2A24",
    charac_name: "Model Number",
    payload_size: "4",
    ble: "r",
    lora: "r",
    type: CharacType.MODEL_NUMBER
  },
  serial_number: {
    uuid: "2A25",
    charac_name: "Serial Number",
    payload_size: "12",
    ble: "r",
    lora: "r",
    type: CharacType.SERIAL_NUMBER
  },
  firmware_resolution: {
    uuid: "2A26",
    charac_name: "Firmware revision",
    payload_size: "40",
    ble: "r",
    lora: "r",
    type: CharacType.FIRMWARE_RESOLUTION
  },
  hardware_revision: {
    uuid: "2A27",
    charac_name: "Hardware revision",
    payload_size: "7",
    ble: "r",
    lora: "r",
    type: CharacType.HARDWARE_REVISION
  },
  manufacturer: {
    uuid: "2A29",
    charac_name: "Manufacturer",
    payload_size: "9",
    ble: "r",
    lora: "r",
    type: CharacType.MANUFACTURER
  },
  sensor_diagnosis: {
    uuid: "CF01",
    charac_name: "Sensor Diagnosis",
    payload_size: "1",
    ble: "r",
    lora: "r",
    type: CharacType.SENSOR_DIAGNOSIS
  },
  communication_diagnosis: {
    uuid: "CF02",
    charac_name: "Communication Diagnosis",
    payload_size: "1",
    ble: "r",
    lora: "r",
    type: CharacType.COMMUNICATION_DIAGNOSIS
  },
  battery_diagnosis: {
    uuid: "CF03",
    charac_name: "Battery Diagnosis",
    payload_size: "1",
    ble: "r",
    lora: "r",
    type: CharacType.BATTERY_DIAGNOSIS
  },
  device_status: {
    uuid: "FC01",
    charac_name: "Device status",
    payload_size: "1",
    ble: "r|n",
    lora: "r",
    type: CharacType.DEVICE_STATUS
  },
  battery: {
    uuid: "2A19",
    charac_name: "Battery level",
    payload_size: "1",
    ble: "r|w|n",
    lora: "r|w|wr",
    type: CharacType.BATTERY
  },
  ble_activation: {
    uuid: "CD05",
    charac_name: "BLE Activation over LoRa",
    payload_size: "1",
    ble: "",
    lora: "r|w|wr",
    type: CharacType.BLE_ACTIVATION
  },
  internal_temperature: {
    uuid: "2A6E",
    charac_name: "Internal platform temperature",
    payload_size: "2",
    ble: "r|n",
    lora: "r",
    type: CharacType.INTERNAL_TEMPERATURE
  },
  keepalive: {
    uuid: "CE01",
    charac_name: "LoRa Keep Alive",
    payload_size: "1",
    ble: "r|w",
    lora: "r|w|wr",
    type: CharacType.KEEPALIVE
  },
  meas_counter: {
    uuid: "B301",
    charac_name: "Measurement Counter",
    payload_size: "2",
    ble: "r|w|n",
    lora: "r",
    type: CharacType.MEAS_COUNTER
  },
  meas_interval: {
    uuid: "B302",
    charac_name: "Measurement interval",
    payload_size: "3",
    ble: "r|w",
    lora: "r|w|wr", // Writeable only on SP
    type: CharacType.MEAS_INTERVAL
  },
  last_data_acquired: {
    uuid: "DA01",
    charac_name: "Last data acquired",
    payload_size: "6",
    ble: "r|n",
    lora: "r",
    type: CharacType.LAST_DATA_ACQUIRED
  },
  threshold: {
    uuid: "B201",
    charac_name: "Threshold",
    payload_size: "6",
    ble: "r|w|n",
    lora: "w|wr",
    type: CharacType.THRESHOLD
  },
  datalog_data: {
    uuid: "DB01",
    charac_name: "Datalog data",
    payload_size: "4",
    ble: "r|w|n",
    lora: "wr",
    type: CharacType.DATALOG_DATA
  },
  datalog_analysis: {
    uuid: "DB02",
    charac_name: "Datalog analysis request",
    payload_size: "3",
    ble: "r|w|n",
    lora: "wr",
    type: CharacType.DATALOG_ANALYSIS
  },
  lora_mode: {
    uuid: "F810",
    charac_name: "LoRaWAN Mode Configuration",
    payload_size: "1",
    ble: "r|w",
    lora: "r|w|wr",
    type: CharacType.LORA_MODE
  },
  dev_eui: {
    uuid: "F801",
    charac_name: "DevEUI",
    payload_size: "8",
    ble: "r",
    lora: "r",
    type: CharacType.DEV_EUI
  },
  app_eui: {
    uuid: "F802",
    charac_name: "AppEUI",
    payload_size: "1",
    ble: "r",
    lora: "r",
    type: CharacType.APP_EUI
  },
  region: {
    uuid: "F803",
    charac_name: "Region",
    payload_size: "1",
    ble: "r",
    lora: "r",
    type: CharacType.REGION
  },
  net_id: {
    uuid: "F804",
    charac_name: "NetID",
    payload_size: "4",
    ble: "r",
    lora: "r",
    type: CharacType.NET_ID
  },
  lora_status: {
    uuid: "F805",
    charac_name: "LoRaWAN Status",
    payload_size: "4",
    ble: "r",
    lora: "r",
    type: CharacType.LORA_STATUS
  },
  lora_percentage: {
    uuid: "F806",
    charac_name: "Percentage of confirmed uplink",
    payload_size: "1",
    ble: "r|w",
    lora: "r|w|wr",
    type: CharacType.LORA_PERCENTAGE
  },
  // MULTIPOINT
  axis_selection: {
    uuid: "FA01",
    charac_name: "Axis selection",
    payload_size: "1",
    ble: "r|w",
    lora: "r|w|wr",
    type: CharacType.AXIS_SELECTION
  },
  preset_selection: {
    uuid: "FA02",
    charac_name: "Preset selection",
    payload_size: "2",
    ble: "r|w",
    lora: "r|w|wr",
    type: CharacType.PRESET_SELECTION
  },
  windowing_function: {
    uuid: "FA03",
    charac_name: "Windowing function",
    payload_size: "1",
    ble: "r|w",
    lora: "r|w|wr",
    type: CharacType.WINDOWING_FUNCTION
  },
  preset_configuration: {
    uuid: "FA10",
    charac_name: "Preset configuration",
    payload_size: "6",
    ble: "r|w",
    lora: "r|w|wr",
    type: CharacType.PRESET_CONFIGURATION
  },
  preset_request: {
    uuid: "FA10",
    charac_name: "Preset request configuration",
    payload_size: "1",
    ble: "r|w",
    lora: "r|w|wr",
    type: CharacType.PRESET_REQUEST
  },
  window_configuration: {
    uuid: "FA11",
    charac_name: "Window Configuration",
    payload_size: "8",
    ble: "r|w",
    lora: "r|w|wr",
    type: CharacType.WINDOW_CONFIGURATION
  },
  window_request: {
    uuid: "FA11",
    charac_name: "Window Request",
    payload_size: "2",
    ble: "r|w",
    lora: "r|w|wr",
    type: CharacType.WINDOW_REQUEST
  },
  multipoint_threshold: {
    uuid: "B201",
    charac_name: "Multipoint Threshold",
    payload_size: "6",
    ble: "r|w|n",
    lora: "w|wr",
    type: CharacType.MULTIPOINT_THRESHOLD
  },
  multipoint_threshold_request: {
    uuid: "B201",
    charac_name: "Multipoint Threshold Request",
    payload_size: "2",
    ble: "r|w|n",
    lora: "w|wr",
    type: CharacType.MULTIPOINT_THRESHOLD_REQUEST
  },
};


export enum Multipoint_Threshold_ID_DATA {
  X_TS_MAG_RMS_threshold = 0x10,
  X_TS_P2P_threshold = 0x11,
  X_FS_Magnitude_RMS = 0x12,
  X_FS_Velocity_RMS_threshold = 0x13,
  X_Analysis_window_RMS_of_window_1 = 0x14,
  X_Analysis_window_RMS_of_window_2 = 0x15,
  X_Analysis_window_RMS_of_window_3 = 0x16,
  X_Analysis_window_RMS_of_window_4 = 0x17,
  X_Analysis_window_RMS_of_window_5 = 0x18,
  X_Analysis_window_RMS_of_window_6 = 0x19,
  X_Analysis_window_RMS_of_window_7 = 0x1A,
  X_Analysis_window_RMS_of_window_8 = 0x1B,
  Y_TS_MAG_RMS_threshold = 0x30,
  Y_TS_P2P_threshold = 0x31,
  Y_FS_Magnitude_RMS = 0x32,
  Y_FS_Velocity_RMS_threshold = 0x33,
  Y_Analysis_window_RMS_of_window_1 = 0x34,
  Y_Analysis_window_RMS_of_window_2 = 0x35,
  Y_Analysis_window_RMS_of_window_3 = 0x36,
  Y_Analysis_window_RMS_of_window_4 = 0x37,
  Y_Analysis_window_RMS_of_window_5 = 0x38,
  Y_Analysis_window_RMS_of_window_6 = 0x39,
  Y_Analysis_window_RMS_of_window_7 = 0x3A,
  Y_Analysis_window_RMS_of_window_8 = 0x3B,
  Z_TS_MAG_RMS_threshold = 0x50,
  Z_TS_P2P_threshold = 0x51,
  Z_FS_Magnitude_RMS = 0x52,
  Z_FS_Velocity_RMS_threshold = 0x53,
  Z_Analysis_window_RMS_of_window_1 = 0x54,
  Z_Analysis_window_RMS_of_window_2 = 0x55,
  Z_Analysis_window_RMS_of_window_3 = 0x56,
  Z_Analysis_window_RMS_of_window_4 = 0x57,
  Z_Analysis_window_RMS_of_window_5 = 0x58,
  Z_Analysis_window_RMS_of_window_6 = 0x59,
  Z_Analysis_window_RMS_of_window_7 = 0x5A,
  Z_Analysis_window_RMS_of_window_8 = 0x5B,
  Temperature = 0x02
}