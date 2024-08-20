import { FrequencyBoundariesError, FrequencyRangeError, PeakRangeError, PresetRangeError, TimeOutOfRangeError, UnkownCharacTypeError, WindowingFunctionError, WindowRangeError } from "./Exceptions";
import { displayUint8ArrayAsHex, insertValueInByte, is_in_byte_range, is_in_range_inclusive, numberToByteArray, uint8ArrayToBase64 } from "./Helper";
import { Characteristic, CharacType, Operation, SensorFamily, UserPayloadType } from "./Schemas";

/** Découpe un string "A0A0A" en tableau de byte [0x0A,0x0A,0x0A]
 */
function toByteArray(byte_string: string, size: number) {
  // Assurer que la longueur de la chaîne hexadécimale est un multiple de 2
  byte_string = byte_string.padStart(size * 2, '0');

  // Convertir chaque paire de caractères hexadécimaux en un octet
  let byteArray = [];
  for (let i = 0; i < byte_string.length; i += 2) {
    byteArray.unshift(parseInt(byte_string.substring(i, i + 2), 16));
  }

  // Remplir le tableau avec des zéros s'il est inférieur à la taille spécifiée
  while (byteArray.length < size) {
    byteArray.push(0);
  }

  return byteArray.reverse();
}


/** High Level function to encode frames.
 * 
 * See typescript schemas for the definition of input parameters.
 * 
 * @return Encoded frame as hexstring (e.g. "AABBCC")
 * 
 */
export function encode(charac: Characteristic, operationChosen: Operation, userPayload: UserPayloadType, sensorfamily: SensorFamily = SensorFamily.Singlepoint): Frame {



  if (charac.uuid) {
    if (charac.uuid.length !== 4) {
      throw new Error("UUID shall be 2 bytes long.")
    }
  }
  else {
    throw new Error("UUID field is missing in the characteristic.")
  }

  // TODO : Check charac has the correct shape

  var payload_header = new Uint8Array(3);

  // Operation code
  switch (operationChosen) {
    case "w":
      payload_header[0] = 0x01;
      break;
    case "wr":
      payload_header[0] = 0x02
      break;
    default:
      payload_header[0] = 0x00
  }

  // UUID
  var uuid = parseInt(charac.uuid, 16)
  payload_header[1] = (uuid >> 8) & 0xFF; // 1st byte
  payload_header[2] = uuid & 0xFF;  // 2nd byte



  var payload = new Uint8Array(0)

  // Creation of user payload if needed
  if (operationChosen === Operation.WRITE || operationChosen === Operation.READWRITE) {


    if (charac.lora) {
      const letterPattern = /(w|wr)/;
      if (letterPattern.test(charac.lora) === false) {
        throw new Error("This charactheristic is not writeable.")
      }
    }
    else
      throw new Error("LoRa rights needs to be mentionned inside the charac object. Check Schemas.")

    if (charac.type !== userPayload.type) {
      throw new Error("The payload does not fit with this charactheristic. Take a look at Schemas.")
    }


    payload = payloadFormatter(charac, userPayload)


  }



  // Concatenation of both array
  let frame = new Uint8Array(payload_header.length + payload.length);
  frame.set(payload_header, 0)
  frame.set(payload, payload_header.length)


  const returnedFrame = new Frame(frame)
  if (sensorfamily == SensorFamily.Singlepoint) {
    returnedFrame.fport = 20
  } else {
    // TODO : Discuss with Clément if we put 21 to manage different decoder version
    returnedFrame.fport = 20
  }

  return returnedFrame;
}






function payloadFormatter(charac: Characteristic, user_payload: UserPayloadType) {

  var encoded_input = new Uint8Array(parseInt(charac.payload_size, 10))

  let bytesArray: number[];

  switch (user_payload.type) {
    case (CharacType.MEAS_INTERVAL):
      encoded_input[0] = parseInt(user_payload.hour, 10) //Hour
      encoded_input[1] = parseInt(user_payload.minute, 10) //Minute
      encoded_input[2] = parseInt(user_payload.second, 10) //Second
      break;
    case (CharacType.THRESHOLD):
      encoded_input[0] = parseInt(user_payload.id_data, 16)
      encoded_input[1] = parseInt(user_payload.param_sel, 16)
      bytesArray = toByteArray(user_payload.data32, 4)
      encoded_input.set(bytesArray, 2)
      break;
    case (CharacType.BLE_ACTIVATION):
      encoded_input[0] = user_payload.checked ? 1 : 0;
      break;
    case (CharacType.BATTERY):
      encoded_input[0] = user_payload.reset ? 0xFF : 0;
      break;
    case (CharacType.KEEPALIVE):
      encoded_input[0] = insertValueInByte(encoded_input[0], parseInt(user_payload.keepaliveInterval), 0)
      encoded_input[0] = insertValueInByte(encoded_input[0], parseInt(user_payload.keepaliveMode), 3)
      break;
    case (CharacType.DATALOG_DATA):
      encoded_input[0] = user_payload.datalog_type
      encoded_input.set(numberToByteArray(user_payload.index, 2), 1)
      encoded_input[3] = user_payload.length
      break;
    case (CharacType.DATALOG_ANALYSIS):
      encoded_input[0] = 0x02 // check spec, always 2
      encoded_input.set(numberToByteArray(user_payload.length, 2), 1)
      break;
    case (CharacType.LORA_MODE):
      encoded_input[0] = user_payload.mode
      break;
    case (CharacType.LORA_PERCENTAGE):
      encoded_input[0] = user_payload.percentage
      break;

    // MULTIPOINT
    case (CharacType.AXIS_SELECTION):
      if (user_payload.axis_selected.includes("x"))
        encoded_input[0] = encoded_input[0] | 0x04
      if (user_payload.axis_selected.includes("y"))
        encoded_input[0] = encoded_input[0] | 0x02
      if (user_payload.axis_selected.includes("z"))
        encoded_input[0] = encoded_input[0] | 0x01
      break;
    case (CharacType.PRESET_SELECTION):
      if (!is_in_byte_range(user_payload.main_preset))
        throw new PresetRangeError()

      encoded_input[0] = user_payload.main_preset
      if (user_payload.secondary_preset) {
        if (!is_in_byte_range(user_payload.secondary_preset))
          throw new PresetRangeError()
        encoded_input[1] = user_payload.secondary_preset
      }
      else
        encoded_input[1] = 0xFF
      break;
    case (CharacType.WINDOWING_FUNCTION):
      if (user_payload.function == "none")
        encoded_input[0] = 0x00
      else if (user_payload.function == "hann")
        encoded_input[0] = 0x01
      else if (user_payload.function == "flattop")
        encoded_input[0] = 0x02
      else
        throw new WindowingFunctionError()
      break;
    case (CharacType.PRESET_CONFIGURATION):
      if (!is_in_byte_range(user_payload.meas_interval_hour))
        throw new PresetRangeError()
      encoded_input[0] = user_payload.preset_id

      encoded_input[1] = user_payload.frame_format

      encoded_input[2] = user_payload.bandwidth_mode

      if (!is_in_byte_range(user_payload.meas_interval_hour))
        throw new TimeOutOfRangeError()
      encoded_input[3] = user_payload.meas_interval_hour

      if (!is_in_byte_range(user_payload.meas_interval_minute))
        throw new TimeOutOfRangeError()
      encoded_input[4] = user_payload.meas_interval_minute

      if (!is_in_byte_range(user_payload.meas_interval_second))
        throw new TimeOutOfRangeError()
      encoded_input[5] = user_payload.meas_interval_second

      break;
    case (CharacType.PRESET_REQUEST):
      if (!is_in_byte_range(user_payload.preset_id))
        throw new PresetRangeError()
      encoded_input[0] = user_payload.preset_id
      break;
    case (CharacType.WINDOW_CONFIGURATION):
      if (!is_in_byte_range(user_payload.preset_id))
        throw new PresetRangeError()
      encoded_input[0] = user_payload.preset_id

      if (!is_in_range_inclusive(1, 8, user_payload.window_id))
        throw new WindowRangeError()
      encoded_input[1] = user_payload.window_id

      encoded_input[2] = user_payload.enable == true ? 0x01 : 0x00

      if (!is_in_range_inclusive(1, 64, user_payload.peak_count))
        throw new PeakRangeError()
      encoded_input[3] = user_payload.peak_count

      if (user_payload.frequency_min >= user_payload.frequency_max)
        throw new FrequencyBoundariesError()

      if (!is_in_range_inclusive(0, 20800, user_payload.frequency_min) || !is_in_range_inclusive(0, 20800, user_payload.frequency_max))
        throw new FrequencyRangeError()
      encoded_input[3] = user_payload.peak_count

      encoded_input.set(numberToByteArray(user_payload.frequency_min, 2), 4)
      encoded_input.set(numberToByteArray(user_payload.frequency_max, 2), 6)
      break;
    case (CharacType.WINDOW_REQUEST):
      if (!is_in_byte_range(user_payload.preset_id))
        throw new PresetRangeError()
      encoded_input[0] = user_payload.preset_id

      if (!is_in_range_inclusive(1, 8, user_payload.window_id))
        throw new WindowRangeError()
      encoded_input[1] = user_payload.window_id
      break;
    case (CharacType.MULTIPOINT_THRESHOLD):
      // ID_DATA(1) | PARAM_SEL(1) | DATA32(4)
      encoded_input[0] = user_payload.id_data

      if (user_payload.param_sel == "ths_config") {
        encoded_input[1] = 0x00

        if (user_payload.event_flag)
          encoded_input[2] |= 0x80
        if (user_payload.enabled)
          encoded_input[2] |= 0x40
        if (user_payload.direction == "above")
          encoded_input[2] |= 0x20
        if (user_payload.auto_clear)
          encoded_input[2] |= 0x10
        if (user_payload.set_ble_mode)
          encoded_input[2] |= 0x04
        if (user_payload.set_lora_mode)
          encoded_input[2] |= 0x02
      }
      else if (user_payload.param_sel == "ths_level") {
        encoded_input[1] = 0x01
        encoded_input.set(numberToByteArray(user_payload.level, 4), 2)
      }
      else if (user_payload.param_sel == "communication_mode") {
        encoded_input[1] = 0x03
        switch (user_payload.ble_mode) {
          case "burst+periodic":
            encoded_input[2] = 0x00
            break;
          case "burst":
            encoded_input[2] = 0x01
            break;
          case "silent":
            encoded_input[2] = 0x02
            break;
          case "periodic":
            encoded_input[2] = 0x03
            break;
        }
        switch (user_payload.lora_mode) {
          case "on_measurement":
            encoded_input[3] = 0x00
            break;
        }
      }
      break;
    case (CharacType.MULTIPOINT_THRESHOLD_REQUEST):
      encoded_input[0] = user_payload.id_data
      switch (user_payload.param_sel) {
        case "ths_config":
          encoded_input[1] = 0x00
          break;
        case "ths_level":
          encoded_input[1] = 0x01
          break;
        case "communication_mode":
          encoded_input[1] = 0x03
          break;
      }
      break;
    default:
      throw new UnkownCharacTypeError()

  }

  return encoded_input

}


class Frame {
  private frame: Uint8Array;

  public fport: number;

  constructor(frame: Uint8Array, fport?: number) {
    this.fport = fport ?? 0;
    this.frame = frame;
  }



  /** Method to convert the frame to hex string (e.g. [0x00,0xAA] to "00 AA"
  */
  toHexString(): string {
    return displayUint8ArrayAsHex(this.frame);
  }

  /** Return byte array representation of the frame (e.g. [0x00,0xAA])
  */
  toByteArray(): Uint8Array {
    return this.frame;
  }

  /** Convenience function to return Base64 encoded version of the frame.
  */
  toBase64(): string {
    return uint8ArrayToBase64(this.frame)
  }

}