let btnEncrypt;
let btnDecrypt;
let btnAuto;
let btnAutoDir;
let txtRaw;
let txtEncrypted;
let txtShift;

let auto = false;
let autoEncrypting = true;

let init = () => {
    btnEncrypt = document.getElementById("btnEncrypt");
    btnDecrypt = document.getElementById("btnDecrypt");
    btnAuto = document.getElementById("btnAuto");
    btnAutoDir = document.getElementById("btnAutoDir");
    txtRaw = document.getElementById("txtRaw");
    txtEncrypted = document.getElementById("txtEncrypted");
    txtShift = document.getElementById("txtShift");

    btnEncrypt.addEventListener('click', handleEncryptClick);
    btnDecrypt.addEventListener('click', handleDecryptClick);
    btnAuto.addEventListener('click', handleAutoClick);
    btnAutoDir.addEventListener('click', handleAutoDirClick);
    txtRaw.addEventListener('input', handleTxtRawInput);
    txtEncrypted.addEventListener('input', handleTxtEncryptedInput);
};

let handleEncryptClick = e => {
    let input = txtRaw.value;
    let shift = parseInt(txtShift.value);
    txtEncrypted.value = shift_encrypt(input, shift, false);
};

let handleDecryptClick = e => {
    let input = txtEncrypted.value;
    let shift = parseInt(txtShift.value);
    txtRaw.value = shift_encrypt(input, shift, true);
};

let handleAutoClick = e => {
    auto = !auto;
    if (auto) {
        btnAuto.classList.remove('autoOff');
        btnAuto.classList.add('autoOn');
        btnAuto.value = " Auto: ON  ";
        btnAutoDir.removeAttribute('disabled');
        if(autoEncrypting) {
            handleEncryptClick();
        } else {
            handleDecryptClick();
        }
    } else {
        btnAuto.classList.remove('autoOn');
        btnAuto.classList.add('autoOff');
        btnAuto.value = " Auto: OFF ";
        btnAutoDir.setAttribute('disabled', true);
    }
};

let handleAutoDirClick = e => {
    if(!auto) return;
    autoEncrypting = !autoEncrypting;
    if(autoEncrypting) {
        btnAutoDir.value = "Encrypting...";
        handleEncryptClick();
    } else {
        btnAutoDir.value = "Decrypting..."
        handleDecryptClick();
    }
}

let handleTxtRawInput = e => {
    if(!auto || !autoEncrypting) return;
    handleEncryptClick();
}

let handleTxtEncryptedInput = e => {
    if(!auto || autoEncrypting) return;
    handleDecryptClick();
}

window.onload = () => {
    init();
};