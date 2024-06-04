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
  type: CharacType
}

export enum Operation {
  READ = "r",
  READWRITE = "wr",
  WRITE = "w"
}

export enum CharacType {
  MEAS_INTERVAL = "meas_interval",
  THREHSOLD = "threshold",
  BLE_ACTIVATION = "ble_activation",
  BATTERY = "battery",
  KEEPALIVE = "keepalive",
  DATALOG_DATA = "datalog_data",
  DATALOG_ANALYSIS = "datalog_analysis",
  LORA_MODE = "lora_mode",
  LORA_PERCENTAGE = "lora_percentage",
}

// ---------------------
//  SCHEMAS FOR USER PAYLOAD
// ---------------------
export interface MeasIntervalType {
  type?: CharacType.MEAS_INTERVAL
  hour: string,
  minute: string,
  second: string
}

export interface BLEActivationType {
  type?: CharacType.BLE_ACTIVATION
  checked: boolean
}

export interface ThresholdType {
  type?: CharacType.THREHSOLD
  id_data: string,
  param_sel: string,
  data32: string
}

export interface BatteryType {
  type?: CharacType.BATTERY
  reset: boolean,
}

export interface KeepaliveType {
  type?: CharacType.KEEPALIVE
  keepaliveInterval: string,
  keepaliveMode: string,
}

export interface DatalogArrayType {
  type?: CharacType.DATALOG_DATA
  datalog_type: number,
  index: number,
  length: number
}

export interface DatalogAnalysisType {
  type?: CharacType.DATALOG_ANALYSIS
  length: number
}

export interface LoramodeType {
  type?: CharacType.LORA_MODE
  mode: number
}

export interface LorapercentageType {
  type?: CharacType.LORA_PERCENTAGE
  percentage: number
}

// Type used when payload is set to {} because frame is read operation (no payload)
export interface EmptyObject {
  type?: "empty"
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
  LorapercentageType;