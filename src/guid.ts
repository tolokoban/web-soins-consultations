const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_"
const DATE_BASE = new Date(2017, 0, 1).getTime()

let lastId = ""
let counter = 0

export default {
    create() {
        const x = Math.floor((Date.now() - DATE_BASE) * .001)
        let id = b64(x)
        if (lastId === id) {
            counter++
            id += '.' + b64(counter)
        } else {
            // Reset the counter because this is a new ID.
            counter = 0
        }
        lastId = id
        return id
    }
}


function b64(x: number) {
    var id = '', digit;
    while (x > 0) {
        digit = x & 63;
        id = ALPHABET.charAt(digit) + id;
        x -= digit;
        x >>= 6;
    }
    return id;
}
