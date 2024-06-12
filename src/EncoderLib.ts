import { displayUint8ArrayAsHex, insertValueInByte, numberToByteArray, uint8ArrayToBase64 } from "./Helper";
import { CharacType, Characteristic, Operation, SensorFamily, UserPayloadType } from "./Schemas";

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

  if (sensorfamily) {
    //should have a different behavior depending on sensor family, currently support only SP
  }

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


  return new Frame(frame);
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
  }

  return encoded_input

}


class Frame {
  private frame: Uint8Array;

  constructor(frame: Uint8Array) {
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