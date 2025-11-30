import { PrivateKey } from "@hashgraph/sdk";

async function main() {
    // Generate a new ECDSA private key
    const privateKey = PrivateKey.generateECDSA();
    const publicKey = privateKey.publicKey;

    console.log("---------------------------------------------------------");
    console.log("NEW HEDERA KEYS GENERATED");
    console.log("---------------------------------------------------------");
    console.log(`Private Key: ${privateKey.toString()}`);
    console.log(`Public Key:  ${publicKey.toString()}`);
    console.log("---------------------------------------------------------");
    console.log("Copy these keys to your .env file or safe storage.");
}

main();
