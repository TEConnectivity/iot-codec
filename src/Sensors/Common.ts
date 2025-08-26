import { AxisSelectionType, Charac_DB_MP, CharacTypeMP, MultipointThresholdCommModeType, MultipointThresholdConfigType, MultipointThresholdHL, MultipointThresholdLevelType, MultipointThresholdRequestType, PresetConfigurationType, PresetRequestType, PresetSelectionType, WindowConfigurationType, WindowingFunctionType, WindowRequestType } from "./MP"
import { Charac_DB_SP, CharacTypeSP, DatalogAnalysisType, DatalogArrayType } from "./SP"
import { Charac_DB_Vib4_2, CharacTypeVib4_2, ProtocolVersionType } from "./4.2.0/Vibration"
import { Charac_DB_Vib5_2, CharacTypeVib5_2, RawTimeDataType } from "./5.2.0/Vibration"


export enum SensorFamily {
  Singlepoint = "SP",
  Multipoint = "MP",
  Vibration4_1 = Multipoint,
  Vibration4_2 = "Vib_4.2",
  Vibration4_3 = "Vib_4.3"
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
  WRITEREAD = "wr",
  WRITE = "w"
}


export enum CharacTypeCommon {
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
  MODEL_NUMBER = "model_number",
  NET_ID = "net_id",
  REGION = "region",
  SENSOR_DIAGNOSIS = "sensor_diagnosis",
  SERIAL_NUMBER = "serial_number",
  THRESHOLD = "threshold",
  TRIGGER_MEASUREMENT = "trig_meas",
}




export type CharacType = CharacTypeCommon | CharacTypeSP | CharacTypeMP | CharacTypeVib4_2 | CharacTypeVib5_2


// ---------------------
//  FRAME FORMAT FOR USER PAYLOAD
// ---------------------

/**
 * MeasInterval is only WRITEABLE for Singlepoint. For Vibration please use Preset Configuration.
 */
export interface MeasIntervalType {
  type: CharacTypeSP.MEAS_INTERVAL
  hour: string,
  minute: string,
  second: string
}

export interface BLEActivationType {
  type: CharacTypeCommon.BLE_ACTIVATION
  checked: boolean
}

/**
 * This schema is compliant with both SP & MP threshold. 
 * 
 * DATA32 is a four byte array. Check related specification.
 */
export interface ThresholdType {
  type: CharacTypeCommon.THRESHOLD
  id_data: string,
  param_sel: string,
  data32: string
}

export interface BatteryType {
  type: CharacTypeCommon.BATTERY
  reset: boolean,
}

export interface KeepaliveType {
  type: CharacTypeCommon.KEEPALIVE
  keepaliveInterval: string,
  keepaliveMode: string,
}


export interface LoramodeType {
  type: CharacTypeCommon.LORA_MODE
  mode: number
}

export interface LorapercentageType {
  type: CharacTypeCommon.LORA_PERCENTAGE
  percentage: number
}

// Type used when payload is set to {} because frame is read operation (no payload)
export interface EmptyObject {
  type: "empty"
}

export interface TriggerMeasType {
  type: CharacTypeCommon.TRIGGER_MEASUREMENT
  disconnect: boolean,
}


export type UserPayloadType = MeasIntervalType |
  TriggerMeasType |
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
  MultipointThresholdRequestType |
  MultipointThresholdHL |
  RawTimeDataType |
  ProtocolVersionType


/**
 * These type of payload are special composite payload providing a high level
 *  structure allowing you to generate multiple frame at once (much simpler than generate all the single frame)
 * 
 * TODO : Support singlepoint Threshold
 */
export type MultiFramePayload = MultipointThresholdHL


export const Charac_DB_common: Record<CharacTypeCommon, Characteristic> = {
  model_number: {
    uuid: "2A24",
    charac_name: "Model Number",
    payload_size: "4",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon.MODEL_NUMBER
  },
  serial_number: {
    uuid: "2A25",
    charac_name: "Serial Number",
    payload_size: "12",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon.SERIAL_NUMBER
  },
  firmware_resolution: {
    uuid: "2A26",
    charac_name: "Firmware revision",
    payload_size: "40",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon.FIRMWARE_RESOLUTION
  },
  hardware_revision: {
    uuid: "2A27",
    charac_name: "Hardware revision",
    payload_size: "7",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon.HARDWARE_REVISION
  },
  manufacturer: {
    uuid: "2A29",
    charac_name: "Manufacturer",
    payload_size: "9",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon.MANUFACTURER
  },
  sensor_diagnosis: {
    uuid: "CF01",
    charac_name: "Sensor Diagnosis",
    payload_size: "1",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon.SENSOR_DIAGNOSIS
  },
  communication_diagnosis: {
    uuid: "CF02",
    charac_name: "Communication Diagnosis",
    payload_size: "1",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon.COMMUNICATION_DIAGNOSIS
  },
  battery_diagnosis: {
    uuid: "CF03",
    charac_name: "Battery Diagnosis",
    payload_size: "1",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon.BATTERY_DIAGNOSIS
  },
  device_status: {
    uuid: "FC01",
    charac_name: "Device status",
    payload_size: "1",
    ble: "r|n",
    lora: "r",
    type: CharacTypeCommon.DEVICE_STATUS
  },
  battery: {
    uuid: "2A19",
    charac_name: "Battery level",
    payload_size: "1",
    ble: "r|w|n",
    lora: "r|w|wr",
    type: CharacTypeCommon.BATTERY
  },
  ble_activation: {
    uuid: "CD05",
    charac_name: "BLE Activation over LoRa",
    payload_size: "1",
    ble: "",
    lora: "r|w|wr",
    type: CharacTypeCommon.BLE_ACTIVATION
  },
  internal_temperature: {
    uuid: "2A6E",
    charac_name: "Internal platform temperature",
    payload_size: "2",
    ble: "r|n",
    lora: "r",
    type: CharacTypeCommon.INTERNAL_TEMPERATURE
  },
  keepalive: {
    uuid: "CE01",
    charac_name: "LoRa Keep Alive",
    payload_size: "1",
    ble: "r|w",
    lora: "r|w|wr",
    type: CharacTypeCommon.KEEPALIVE
  },
  meas_counter: {
    uuid: "B301",
    charac_name: "Measurement Counter",
    payload_size: "2",
    ble: "r|w|n",
    lora: "r",
    type: CharacTypeCommon.MEAS_COUNTER
  },
  last_data_acquired: {
    uuid: "DA01",
    charac_name: "Last data acquired",
    payload_size: "6",
    ble: "r|n",
    lora: "r",
    type: CharacTypeCommon.LAST_DATA_ACQUIRED
  },
  threshold: {
    uuid: "B201",
    charac_name: "Threshold",
    payload_size: "6",
    ble: "r|w|n",
    lora: "w|wr",
    type: CharacTypeCommon.THRESHOLD
  },
  lora_mode: {
    uuid: "F810",
    charac_name: "LoRaWAN Mode Configuration",
    payload_size: "1",
    ble: "r|w",
    lora: "r|w|wr",
    type: CharacTypeCommon.LORA_MODE
  },
  dev_eui: {
    uuid: "F801",
    charac_name: "DevEUI",
    payload_size: "8",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon.DEV_EUI
  },
  app_eui: {
    uuid: "F802",
    charac_name: "AppEUI",
    payload_size: "1",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon.APP_EUI
  },
  region: {
    uuid: "F803",
    charac_name: "Region",
    payload_size: "1",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon.REGION
  },
  net_id: {
    uuid: "F804",
    charac_name: "NetID",
    payload_size: "4",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon.NET_ID
  },
  lora_status: {
    uuid: "F805",
    charac_name: "LoRaWAN Status",
    payload_size: "4",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon.LORA_STATUS
  },
  lora_percentage: {
    uuid: "F806",
    charac_name: "Percentage of confirmed uplink",
    payload_size: "1",
    ble: "r|w",
    lora: "r|w|wr",
    type: CharacTypeCommon.LORA_PERCENTAGE
  },
  trig_meas: {
    uuid: "B303",
    charac_name: "Trigger Measurement",
    payload_size: "1",
    ble: "w",
    lora: "w",
    type: CharacTypeCommon.TRIGGER_MEASUREMENT
  }
}



export type FirmwareSupportMapType = typeof FirmwareSupportMap;


// Enums for better autocomplete and documentation
export enum FirmwareVersion {
  /** Firmware applying to singlepoint sensors */
  V3_5 = "3.5",
  /** Firmware applying to vibration sensors. Called "multipoint" in the documentation. */
  V4_1 = "4.1",
  /** 4.2 Beta, applying to vibration sensors */
  V4_2_beta = "4.2",

  /** 4.2 Beta, applying to vibration sensors for now */
  V5_2_beta = "5.2"
}

export enum DeviceModel {
  /** Humidity, Pressure, Temperature sensors : 59XXN, 69XXN, 79XXN */
  SINGLEPOINT = "SP",
  /** Vibration sensors : 8931N, 8911N */
  VIBRATION = "Vib"
}


export type FirmwareCharacs<
  V extends FirmwareVersion,
  M extends keyof FirmwareSupportMapType[V]
> = FirmwareSupportMapType[V][M];



/* Which feature is supported on which firmware & model */
export const FirmwareSupportMap = {
  [FirmwareVersion.V3_5]: {
    [DeviceModel.SINGLEPOINT]: {
      ...Charac_DB_common,
      ...Charac_DB_SP
    }
  },
  [FirmwareVersion.V4_1]: {
    [DeviceModel.VIBRATION]: {
      ...Charac_DB_common,
      ...Charac_DB_MP,
    }
  },
  [FirmwareVersion.V4_2_beta]: {
    [DeviceModel.VIBRATION]: {
      ...Charac_DB_common,
      ...Charac_DB_MP,
      ...Charac_DB_Vib4_2
    }
  },
  [FirmwareVersion.V5_2_beta]: {
    [DeviceModel.VIBRATION]: {
      ...Charac_DB_Vib5_2
    }
  }
} as const;


