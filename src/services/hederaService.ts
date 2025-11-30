import {
    Client,
    AccountId,
    PrivateKey,
    HbarUnit,
    Hbar,
    TransferTransaction,
    AccountBalanceQuery,
    TokenCreateTransaction,
    TokenMintTransaction,
    TokenAssociateTransaction,
    TokenType,
    TokenSupplyType,
    AccountCreateTransaction,
    TopicCreateTransaction,
    TopicMessageSubmitTransaction,
    TopicMessageQuery,
    PublicKey,
} from '@hashgraph/sdk';

/**
 * Hedera Service - Manages Hedera Hashgraph operations
 * Singleton pattern to ensure single client instance
 */
class HederaService {
    private client: Client | null = null;
    private operatorId: AccountId | null = null;
    private operatorKey: PrivateKey | null = null;

    /**
     * Initialize Hedera client with credentials from environment
     */
    initialize() {
        if (this.client) {
            return this.client; // Already initialized
        }

        const accountId = process.env.OPERATOR_ID;
        const privateKey = process.env.OPERATOR_KEY;
        const network = process.env.HEDERA_NETWORK || 'testnet';

        if (!accountId || !privateKey) {
            throw new Error('Missing OPERATOR_ID or OPERATOR_KEY in environment variables');
        }

        try {
            this.operatorId = AccountId.fromString(accountId);
            this.operatorKey = PrivateKey.fromStringECDSA(privateKey);

            // Create client based on network
            if (network === 'mainnet') {
                this.client = Client.forMainnet();
            } else {
                this.client = Client.forTestnet();
            }

            // Set operator
            this.client.setOperator(this.operatorId, this.operatorKey);

            console.log('✅ Hedera client initialized successfully');
            return this.client;
        } catch (error) {
            console.error('❌ Failed to initialize Hedera client:', error);
            throw error;
        }
    }

    /**
     * Get the initialized client
     */
    getClient(): Client {
        if (!this.client) {
            this.initialize();
        }
        return this.client!;
    }

    /**
     * Get operator account ID
     */
    getOperatorId(): AccountId {
        if (!this.operatorId) {
            this.initialize();
        }
        return this.operatorId!;
    }

    /**
     * Close the client connection
     */
    close() {
        if (this.client) {
            this.client.close();
            this.client = null;
            console.log('🔒 Hedera client closed');
        }
    }

    // ==================== ACCOUNT OPERATIONS ====================

    /**
     * Get account balance
     */
    async getAccountBalance(accountId: string): Promise<string> {
        const client = this.getClient();
        const balance = await new AccountBalanceQuery()
            .setAccountId(accountId)
            .execute(client);

        return balance.hbars.toString();
    }

    /**
     * Get account balance from Mirror Node (Free)
     */
    async getMirrorAccountBalance(accountId: string): Promise<string> {
        const network = process.env.HEDERA_NETWORK || 'testnet';
        const baseUrl = network === 'mainnet'
            ? 'https://mainnet-public.mirrornode.hedera.com'
            : 'https://testnet.mirrornode.hedera.com';

        const response = await fetch(`${baseUrl}/api/v1/accounts/${accountId}/balances`);

        if (!response.ok) {
            throw new Error(`Failed to fetch balance from mirror node: ${response.statusText}`);
        }

        const data = await response.json();
        // @ts-ignore
        const balance = data.balances[0].balance;

        // Convert tinybars to HBAR (1 HBAR = 100,000,000 tinybars)
        return (balance / 100_000_000).toString();
    }

    /**
     * Create a new account
     */
    async createAccount(
        initialBalance: number = 10,
        publicKey?: string
    ): Promise<{
        accountId: string;
        privateKey?: string;
        publicKey: string;
    }> {
        const client = this.getClient();
        let newAccountPublicKey;
        let newAccountPrivateKey;

        if (publicKey) {
            // Use provided public key (e.g. ECDSA)
            newAccountPublicKey = PublicKey.fromString(publicKey);
        } else {
            // Generate new ED25519 key pair
            newAccountPrivateKey = PrivateKey.generateED25519();
            newAccountPublicKey = newAccountPrivateKey.publicKey;
        }

        const transaction = await new AccountCreateTransaction()
            .setKey(newAccountPublicKey)
            .setInitialBalance(Hbar.from(initialBalance, HbarUnit.Hbar))
            .execute(client);

        const receipt = await transaction.getReceipt(client);
        const newAccountId = receipt.accountId;

        if (!newAccountId) {
            throw new Error('Failed to create account');
        }

        return {
            accountId: newAccountId.toString(),
            privateKey: newAccountPrivateKey?.toString(),
            publicKey: newAccountPublicKey.toString(),
        };
    }

    // ==================== TRANSFER OPERATIONS ====================

    /**
     * Transfer HBAR between accounts
     */
    async transferHbar(
        recipientId: string,
        amount: number
    ): Promise<{
        status: string;
        transactionId: string;
    }> {
        const client = this.getClient();
        const operatorId = this.getOperatorId();

        const transaction = await new TransferTransaction()
            .addHbarTransfer(operatorId, Hbar.from(-amount, HbarUnit.Hbar))
            .addHbarTransfer(recipientId, Hbar.from(amount, HbarUnit.Hbar))
            .execute(client);

        const receipt = await transaction.getReceipt(client);

        return {
            status: receipt.status.toString(),
            transactionId: transaction.transactionId.toString(),
        };
    }

    // ==================== TOKEN OPERATIONS ====================

    /**
     * Create a fungible token
     */
    async createToken(
        name: string,
        symbol: string,
        initialSupply: number,
        decimals: number = 2
    ): Promise<{
        tokenId: string;
        transactionId: string;
    }> {
        const client = this.getClient();
        const operatorId = this.getOperatorId();
        const operatorKey = this.operatorKey!;

        const transaction = await new TokenCreateTransaction()
            .setTokenName(name)
            .setTokenSymbol(symbol)
            .setDecimals(decimals)
            .setInitialSupply(initialSupply)
            .setTreasuryAccountId(operatorId)
            .setAdminKey(operatorKey)
            .setSupplyKey(operatorKey)
            .setTokenType(TokenType.FungibleCommon)
            .setSupplyType(TokenSupplyType.Infinite)
            .freezeWith(client)
            .sign(operatorKey);

        const txResponse = await transaction.execute(client);
        const receipt = await txResponse.getReceipt(client);

        if (!receipt.tokenId) {
            throw new Error('Failed to create token');
        }

        return {
            tokenId: receipt.tokenId.toString(),
            transactionId: txResponse.transactionId.toString(),
        };
    }

    /**
     * Create an NFT collection
     */
    async createNFT(
        name: string,
        symbol: string
    ): Promise<{
        tokenId: string;
        transactionId: string;
    }> {
        const client = this.getClient();
        const operatorId = this.getOperatorId();
        const operatorKey = this.operatorKey!;

        const transaction = await new TokenCreateTransaction()
            .setTokenName(name)
            .setTokenSymbol(symbol)
            .setTokenType(TokenType.NonFungibleUnique)
            .setDecimals(0)
            .setInitialSupply(0)
            .setTreasuryAccountId(operatorId)
            .setSupplyType(TokenSupplyType.Infinite)
            .setAdminKey(operatorKey)
            .setSupplyKey(operatorKey)
            .freezeWith(client)
            .sign(operatorKey);

        const txResponse = await transaction.execute(client);
        const receipt = await txResponse.getReceipt(client);

        if (!receipt.tokenId) {
            throw new Error('Failed to create NFT');
        }

        return {
            tokenId: receipt.tokenId.toString(),
            transactionId: txResponse.transactionId.toString(),
        };
    }

    /**
     * Mint NFTs
     */
    async mintNFT(
        tokenId: string,
        metadata: string[]
    ): Promise<{
        serials: number[];
        transactionId: string;
    }> {
        const client = this.getClient();
        const operatorKey = this.operatorKey!;

        // Convert metadata to bytes
        const metadataBytes = metadata.map((m) => Buffer.from(m));

        const transaction = await new TokenMintTransaction()
            .setTokenId(tokenId)
            .setMetadata(metadataBytes)
            .freezeWith(client)
            .sign(operatorKey);

        const txResponse = await transaction.execute(client);
        const receipt = await txResponse.getReceipt(client);

        return {
            serials: receipt.serials.map((s) => s.toNumber()),
            transactionId: txResponse.transactionId.toString(),
        };
    }

    /**
     * Associate token with account
     */
    async associateToken(
        accountId: string,
        tokenId: string,
        accountPrivateKey: string
    ): Promise<string> {
        const client = this.getClient();
        const privateKey = PrivateKey.fromString(accountPrivateKey);

        const transaction = await new TokenAssociateTransaction()
            .setAccountId(accountId)
            .setTokenIds([tokenId])
            .freezeWith(client)
            .sign(privateKey);

        const txResponse = await transaction.execute(client);
        const receipt = await txResponse.getReceipt(client);

        return receipt.status.toString();
    }

    // ==================== CONSENSUS SERVICE (HCS) ====================

    /**
     * Create a topic for consensus messages
     */
    async createTopic(memo?: string): Promise<{
        topicId: string;
        transactionId: string;
    }> {
        const client = this.getClient();
        const operatorKey = this.operatorKey!;

        const transaction = new TopicCreateTransaction()
            .setAdminKey(operatorKey)
            .setSubmitKey(operatorKey);

        if (memo) {
            transaction.setTopicMemo(memo);
        }

        const txResponse = await transaction.execute(client);
        const receipt = await txResponse.getReceipt(client);

        if (!receipt.topicId) {
            throw new Error('Failed to create topic');
        }

        return {
            topicId: receipt.topicId.toString(),
            transactionId: txResponse.transactionId.toString(),
        };
    }

    /**
     * Submit message to topic
     */
    async submitMessage(
        topicId: string,
        message: string
    ): Promise<{
        sequenceNumber: string;
        transactionId: string;
    }> {
        const client = this.getClient();

        const transaction = await new TopicMessageSubmitTransaction()
            .setTopicId(topicId)
            .setMessage(message)
            .execute(client);

        const receipt = await transaction.getReceipt(client);

        return {
            sequenceNumber: receipt.topicSequenceNumber?.toString() || '0',
            transactionId: transaction.transactionId.toString(),
        };
    }

    /**
     * Subscribe to topic messages
     */
    subscribeToTopic(
        topicId: string,
        onMessage: (message: {
            consensusTimestamp: string;
            message: string;
            sequenceNumber: string;
        }) => void
    ): () => void {
        const client = this.getClient();

        const subscription = new TopicMessageQuery()
            .setTopicId(topicId)
            .subscribe(client, null, (message) => {
                onMessage({
                    consensusTimestamp: message.consensusTimestamp.toString(),
                    message: Buffer.from(message.contents).toString(),
                    sequenceNumber: message.sequenceNumber.toString(),
                });
            });

        // Return unsubscribe function
        return () => {
            subscription.unsubscribe();
        };
    }
}

// Export singleton instance
export const hederaService = new HederaService();
