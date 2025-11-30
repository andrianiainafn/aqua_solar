import { Client, PrivateKey } from "@hashgraph/sdk";

// Load operator credentials
const operatorId = process.env.NEXT_PUBLIC_OPERATOR_ID;
const operatorKey = process.env.NEXT_PUBLIC_OPERATOR_KEY;

if (!operatorId || !operatorKey) {
    throw new Error("Environment variables NEXT_PUBLIC_OPERATOR_ID and NEXT_PUBLIC_OPERATOR_KEY must be present");
}

// Parse the operator key using ECDSA format
const operatorPrivateKey = PrivateKey.fromStringECDSA(operatorKey);

// Initialize testnet client and set operator
const client = Client.forTestnet().setOperator(operatorId, operatorPrivateKey);

export default client;