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
  DATALOG_ANALYSIS = "datalog_analysis",
  DATALOG_DATA = "datalog_data",
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
  // MP
  // PRESET = "preset"
}

// ---------------------
//  SCHEMAS FOR USER PAYLOAD
// ---------------------
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

export interface DatalogArrayType {
  type: CharacType.DATALOG_DATA
  datalog_type: number,
  index: number,
  length: number
}

export interface DatalogAnalysisType {
  type: CharacType.DATALOG_ANALYSIS
  length: number
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

// export interface Preset {
//   type?: CharacType.PRESET
//   percentage: number
// }

export type UserPayloadType = MeasIntervalType |
  BLEActivationType |
  EmptyObject |
  ThresholdType |
  BatteryType |
  KeepaliveType |
  DatalogArrayType |
  DatalogAnalysisType |
  LoramodeType |
  LorapercentageType;









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
    lora: "r|w|wr",
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
  }
};