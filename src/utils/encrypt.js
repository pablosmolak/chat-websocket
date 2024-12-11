import crypto from 'crypto';

export const encryptMessage = (message) => {
    const secret = process.env.SECRET; // Obter a chave de criptografia da variável de ambiente
    
    if (!secret || secret.length !== 32) {
        throw new Error('A chave de criptografia deve ter 32 bytes');
    }
    
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secret), Buffer.alloc(16, 0)); // IV (vetor de inicialização) deve ser único para cada mensagem em um ambiente real
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

export const decryptMessage = (encryptedMessage) => {
    const secret = process.env.SECRET;
    if (!secret || secret.length !== 32) {
        throw new Error('A chave de criptografia deve ter 32 bytes');
    }
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secret), Buffer.alloc(16, 0)); // IV deve ser o mesmo utilizado para a criptografia
    let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
