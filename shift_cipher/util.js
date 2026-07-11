// did not handle ÆØÅ gracefully so I removed them
const upper_chars = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
const lower_chars = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.toLowerCase());
const alphabet_length = upper_chars.length;
const nums = [...Array(10).keys()];
let char_to_num = {};
upper_chars.concat(lower_chars).forEach((c, i) => char_to_num[c] = i % alphabet_length);
console.log(char_to_num);


let shift_encrypt = (str, shift = 3, decrypt = false) => {
    shift = decrypt ? shift * -1 : shift;
    let out = "";
    for (let s of str) {
        let c = s;
        if (lower_chars.includes(c)) {
            c = lower_chars[(char_to_num[c] + shift + alphabet_length) % alphabet_length];
        } else if (upper_chars.includes(c)) {
            c = upper_chars[(char_to_num[c] + shift + alphabet_length) % alphabet_length];
        }
        out += c;
    }
    return out;
};