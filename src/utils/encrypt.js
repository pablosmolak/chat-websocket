export const Encrypt = (text) => {
    return Buffer.from(`${text}`).toString('base64');
};

export const Decrypt = (encryptedText) => {
    return Buffer.from(encryptedText, 'base64').toString('utf-8');
};
