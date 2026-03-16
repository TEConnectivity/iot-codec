import { Characteristic } from "../Mapping"
import { CharacTypeSP_3_5_0 } from "./SP"



export enum CharacTypeCommon_3_5_0 {
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
  TRIGGER_MEASUREMENT = "trig_meas",
}






// ---------------------
//  FRAME FORMAT FOR USER PAYLOAD
// ---------------------

/**
 * MeasInterval is only WRITEABLE for Singlepoint. For Vibration please use Preset Configuration.
 */
export interface MeasIntervalType {
  type: CharacTypeSP_3_5_0.MEAS_INTERVAL
  hour: string,
  minute: string,
  second: string
}

export interface BLEActivationType {
  type: CharacTypeCommon_3_5_0.BLE_ACTIVATION
  checked: boolean
}



export interface BatteryType {
  type: CharacTypeCommon_3_5_0.BATTERY
  reset: boolean,
}

export interface KeepaliveType {
  type: CharacTypeCommon_3_5_0.KEEPALIVE
  keepaliveInterval: string,
  keepaliveMode: string,
}


export interface LoramodeType {
  type: CharacTypeCommon_3_5_0.LORA_MODE
  mode: "on_measurement" | "silent"
}

export interface LorapercentageType {
  type: CharacTypeCommon_3_5_0.LORA_PERCENTAGE
  percentage: number
}

// Type used when payload is set to {} because frame is read operation (no payload)
export interface EmptyObject {
  type: "empty"
}

export interface TriggerMeasType {
  type: CharacTypeCommon_3_5_0.TRIGGER_MEASUREMENT
  disconnect: boolean,
}



export const Charac_DB_common: Record<CharacTypeCommon_3_5_0, Characteristic> = {
  model_number: {
    uuid: "2A24",
    charac_name: "Model Number",
    payload_size: "4",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon_3_5_0.MODEL_NUMBER
  },
  serial_number: {
    uuid: "2A25",
    charac_name: "Serial Number",
    payload_size: "12",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon_3_5_0.SERIAL_NUMBER
  },
  firmware_resolution: {
    uuid: "2A26",
    charac_name: "Firmware revision",
    payload_size: "40",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon_3_5_0.FIRMWARE_RESOLUTION
  },
  hardware_revision: {
    uuid: "2A27",
    charac_name: "Hardware revision",
    payload_size: "7",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon_3_5_0.HARDWARE_REVISION
  },
  manufacturer: {
    uuid: "2A29",
    charac_name: "Manufacturer",
    payload_size: "9",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon_3_5_0.MANUFACTURER
  },
  sensor_diagnosis: {
    uuid: "CF01",
    charac_name: "Sensor Diagnosis",
    payload_size: "1",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon_3_5_0.SENSOR_DIAGNOSIS
  },
  communication_diagnosis: {
    uuid: "CF02",
    charac_name: "Communication Diagnosis",
    payload_size: "1",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon_3_5_0.COMMUNICATION_DIAGNOSIS
  },
  battery_diagnosis: {
    uuid: "CF03",
    charac_name: "Battery Diagnosis",
    payload_size: "1",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon_3_5_0.BATTERY_DIAGNOSIS
  },
  device_status: {
    uuid: "FC01",
    charac_name: "Device status",
    payload_size: "1",
    ble: "r|n",
    lora: "r",
    type: CharacTypeCommon_3_5_0.DEVICE_STATUS
  },
  battery: {
    uuid: "2A19",
    charac_name: "Battery level",
    payload_size: "1",
    ble: "r|w|n",
    lora: "r|w|wr",
    type: CharacTypeCommon_3_5_0.BATTERY
  },
  ble_activation: {
    uuid: "CD05",
    charac_name: "BLE Activation over LoRa",
    payload_size: "1",
    ble: "",
    lora: "r|w|wr",
    type: CharacTypeCommon_3_5_0.BLE_ACTIVATION
  },
  internal_temperature: {
    uuid: "2A6E",
    charac_name: "Internal platform temperature",
    payload_size: "2",
    ble: "r|n",
    lora: "r",
    type: CharacTypeCommon_3_5_0.INTERNAL_TEMPERATURE
  },
  keepalive: {
    uuid: "CE01",
    charac_name: "LoRa Keep Alive",
    payload_size: "1",
    ble: "r|w",
    lora: "r|w|wr",
    type: CharacTypeCommon_3_5_0.KEEPALIVE
  },
  meas_counter: {
    uuid: "B301",
    charac_name: "Measurement Counter",
    payload_size: "2",
    ble: "r|w|n",
    lora: "r",
    type: CharacTypeCommon_3_5_0.MEAS_COUNTER
  },
  last_data_acquired: {
    uuid: "DA01",
    charac_name: "Last data acquired",
    payload_size: "6",
    ble: "r|n",
    lora: "r",
    type: CharacTypeCommon_3_5_0.LAST_DATA_ACQUIRED
  },
  lora_mode: {
    uuid: "F810",
    charac_name: "LoRaWAN Mode Configuration",
    payload_size: "1",
    ble: "r|w",
    lora: "r|w|wr",
    type: CharacTypeCommon_3_5_0.LORA_MODE
  },
  dev_eui: {
    uuid: "F801",
    charac_name: "DevEUI",
    payload_size: "8",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon_3_5_0.DEV_EUI
  },
  app_eui: {
    uuid: "F802",
    charac_name: "AppEUI",
    payload_size: "1",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon_3_5_0.APP_EUI
  },
  region: {
    uuid: "F803",
    charac_name: "Region",
    payload_size: "1",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon_3_5_0.REGION
  },
  net_id: {
    uuid: "F804",
    charac_name: "NetID",
    payload_size: "4",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon_3_5_0.NET_ID
  },
  lora_status: {
    uuid: "F805",
    charac_name: "LoRaWAN Status",
    payload_size: "4",
    ble: "r",
    lora: "r",
    type: CharacTypeCommon_3_5_0.LORA_STATUS
  },
  lora_percentage: {
    uuid: "F806",
    charac_name: "Percentage of confirmed uplink",
    payload_size: "1",
    ble: "r|w",
    lora: "r|w|wr",
    type: CharacTypeCommon_3_5_0.LORA_PERCENTAGE
  },
  trig_meas: {
    uuid: "B303",
    charac_name: "Trigger Measurement",
    payload_size: "1",
    ble: "w",
    lora: "w",
    type: CharacTypeCommon_3_5_0.TRIGGER_MEASUREMENT
  }
}



