/** Converts a float (number type) to its 32-bit hex representation
 *  Ex: 10.5 -> "41280000"
 */
export function floatToHexString(floatNumber: number) {
    // Create a buffer to store the binary data of the float
    const buffer = new ArrayBuffer(4);
    const intView = new Uint32Array(buffer);
    const floatView = new Float32Array(buffer);

    // Assign the float value
    floatView[0] = floatNumber;

    // Convert to hexadecimal
    const hexString = intView[0].toString(16);

    // Add the 0x prefix
    return hexString;
}

/** Adds leading zeros if necessary to fit into a byte 
 * 
 *  Example: 
 * 
 * input= "C", size=2 -> "0C"
 * 
 *  input "ABC", size=6 -> "000ABC"
 */
export function zeroPadding(input: string, size: number) {
    if (input.length < size) {
        return "0".repeat(size - input.length) + input
    }
    else {
        return input
    }
}


// Pretty print uint8array to hex
export function toHex(byte: number) {
    return ('0' + byte.toString(16).toUpperCase()).slice(-2);
}

/** Converts a uint8array to a hex string
 *  
 * [0x0A,0x02] -> "0A02"
 * @param uint8Array 
 * @returns string
 */
export function displayUint8ArrayAsHex(uint8Array: Uint8Array, space = " "): string {
    let hexString = '';
    for (let i = 0; i < uint8Array.length; i++) {
        hexString += toHex(uint8Array[i]);
        if (i < uint8Array.length - 1) {
            hexString += space; // Adds a space between each byte
        }
    }
    return hexString;
}


/** For a given byte, insert a value at the offset
 *  
 * For example, inserting a=3 in a byte 0x00 at offset 1 would give:
 * 0b00000110
 * Since 3 is "11" in binary
 * 
 * @param byte 
 * @param value 
 * @param offset 
 * @returns 
 */
export function insertValueInByte(byte: number, value: number, offset: number) {
    // Ensure the byte is an integer between 0 and 255
    if (byte < 0 || byte > 255) {
        throw new Error("The byte must be an integer between 0 and 255");
    }

    // Ensure the value is an integer between 0 and 255
    if (value < 0 || value > 255) {
        throw new Error("The value must be an integer between 0 and 255");
    }

    // Ensure the offset is an integer between 0 and 7
    if (offset < 0 || offset > 7) {
        throw new Error("The offset must be an integer between 0 and 7");
    }

    // Create a mask with a single bit at the specified offset
    let mask = 1 << offset;

    // Clear the bit at the specified offset in the byte
    byte &= ~mask;

    // Insert the value into the byte using the bitwise OR operator
    byte |= (value << offset);

    return byte;
}


/** Takes a string "AABBCC" and returns the associated byte array: [0xAA,0xBB,0xCC]
 * 
 * The input must be even (no half byte)
 * 
 * @param hexString 
 * @returns 
 */
export function hexStringToUint8Array(hexString: string) {
    // Check if the hex string has a valid length
    if (hexString.length % 2 !== 0) {
        throw new Error("The hex string must have an even length");
    }

    // Convert the hex string to a byte array
    let byteArray = [];
    for (let i = 0; i < hexString.length; i += 2) {
        let byte = parseInt(hexString.substr(i, 2), 16);
        byteArray.push(byte);
    }

    // Create a Uint8Array from the byte array
    let uint8Array = new Uint8Array(byteArray);

    return uint8Array;
}

/** Converts a number to its byte array
 * 
 * size 2, number 256 -> [0x01, 0xFF]
 * 
 * @param number : number to be converted 
 * @param size : initial size. If the provided size is not enough, it is automatically resized.
 * @returns bytearray
 */
export function numberToByteArray(number: any, size: number) {
    // Determine the number of bytes needed
    const byteCount = Math.ceil(Math.log2(number + 1) / 8);

    // Create an array to store the bytes with the provided size
    const byteArray = new Array(size).fill(0);

    // Check if the provided size is sufficient to hold the number
    if (size < byteCount) {
        size = byteCount;
    }

    // Extract each byte
    for (let i = 0; i < byteCount; i++) {
        const byte = (number >> (8 * (byteCount - i - 1))) & 0xFF;
        byteArray[size - byteCount + i] = byte;
    }

    return byteArray;
}

/** Convert a Base64 encoded string to its representation in hex string "AA BB CC"
 */
export function base64ToHex(base64String: string): string {
    // Convert the Base64 string to a binary string
    let binaryString = atob(base64String);
    // Convert the binary string to a byte array
    let byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
    }
    // Convert the byte array to a hex string
    let hexString = Array.from(byteArray, byte => {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
    return hexString;
}

/**
 *  Encode a uint8array into base64 
 * 
 * [0x01, 0x02] -> "AQI="
 */
export function uint8ArrayToBase64(uint8Array: Uint8Array): string {
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binaryString);
}


export function is_in_byte_range(input: number): boolean {
    return is_in_range_inclusive(0, 255, input)
}

export function is_in_range_inclusive(lower_edge: number, upper_edge: number, input: number): boolean {
    if (lower_edge <= input && input <= upper_edge)
        return true
    else
        return false
}


/** Découpe un string "A0A0A" en tableau de byte [0x0A,0x0A,0x0A]
 */
export function toByteArray(byte_string: string, size: number) {
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
