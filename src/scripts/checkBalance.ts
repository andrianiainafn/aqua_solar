import { hederaService } from '../services/hederaService';
import dotenv from 'dotenv';

import path from 'path';

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function main() {
    try {
        console.log('🔍 Checking account balance via Mirror Node...');

        // Initialize service to ensure env vars are loaded
        hederaService.initialize();

        const operatorId = hederaService.getOperatorId().toString();
        console.log(`👤 Checking balance for account: ${operatorId}`);

        const balance = await hederaService.getMirrorAccountBalance(operatorId);

        console.log(`💰 Balance: ${balance} HBAR`);
        console.log('✅ Balance check successful!');
    } catch (error) {
        console.error('❌ Failed to check balance:', error);
        process.exit(1);
    }
}

main();
