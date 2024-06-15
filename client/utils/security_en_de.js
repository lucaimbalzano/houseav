// import 'dotenv/config'

export default class SecurityEnDe {
    // static ALGORITHM = process.env.VITE_SEC_ALGORITHM;
    // static HASH = process.env.VITE_SEC_HASH;
    // static KEY_SIZE = process.env.VITE_SEC_KEY_SIZE;
    // static ITERATION_COUNT = process.env.VITE_SEC_ITERATION_COUNT;
    static ALGORITHM = import.meta.env.VITE_SEC_ALGORITHM;
    static HASH = import.meta.env.VITE_SEC_HASH;
    static KEY_SIZE = import.meta.env.VITE_SEC_KEY_SIZE;
    static ITERATION_COUNT = import.meta.env.VITE_SEC_ITERATION_COUNT;


    constructor() {
        this.textEncoder = new TextEncoder();
        this.textDecoder = new TextDecoder();
    }

    async generateKeyMaterial(password) {
        return crypto.subtle.importKey(
            "raw",
            this.textEncoder.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
        );
    }

    async generateKey(keyMaterial, salt) {
        const algorithm = SecurityEnDe.ALGORITHM;
        const hash = SecurityEnDe.HASH;
        const iterationCount = SecurityEnDe.ITERATION_COUNT;
        const keySize = SecurityEnDe.KEY_SIZE;
        try {            
            return crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt,
                    iterations: iterationCount,
                    hash: hash
                },
                keyMaterial,
                { 
                    name: algorithm,
                    length: keySize 
                },
                true,
                ["encrypt", "decrypt"]
            );
        } catch (error) {
            console.error("Error occured:"+error);
        }
    }

    async encrypt(plaintext, password) {
        const data = this.textEncoder.encode(plaintext);
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const keyMaterial = await this.generateKeyMaterial(password);
        const key = await this.generateKey(keyMaterial, salt);
        const algorithm = SecurityEnDe.ALGORITHM;
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encryptedData = await crypto.subtle.encrypt(
            {
                name: algorithm,
                iv
            },
            key,
            data
        );

        const ciphertextBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedData)));
        const ivBase64 = btoa(String.fromCharCode.apply(null, iv));
        const saltBase64 = btoa(String.fromCharCode.apply(null, salt));

        return ciphertextBase64 + ":" + ivBase64 + ":" + saltBase64;
    }

    async decrypt(encryptedData, password) {
        const [ciphertextStr, ivStr, saltStr] = encryptedData.split(":");
        const ciphertext = Uint8Array.from(atob(ciphertextStr), c => c.charCodeAt(0));
        const iv = Uint8Array.from(atob(ivStr), c => c.charCodeAt(0));
        const salt = Uint8Array.from(atob(saltStr), c => c.charCodeAt(0));
        const algorithm = SecurityEnDe.ALGORITHM;
        const keyMaterial = await this.generateKeyMaterial(password);
        const key = await this.generateKey(keyMaterial, salt)

        const decryptedData = await crypto.subtle.decrypt(
            {
                name: algorithm,
                iv
            },
            key,
            ciphertext
        );

        return this.textDecoder.decode(decryptedData);
    }

    async testAesGcm() {
        const plaintext = import.meta.env.VITE_USER_QUEUE_REGISTRATION;
        const password = import.meta.env.VITE_USER_QUEUE_REGISTRATION_KEY;
        
        const encryptedData = await this.encrypt(plaintext, password);
        console.log("\nENCRYPTION:"+encryptedData);

        const decryptedData = await this.decrypt(encryptedData, password);
        console.log("\nDECRYPT:"+decryptedData);
    }
}