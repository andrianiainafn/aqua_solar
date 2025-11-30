'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Hook to fetch account balance
 */
export function useAccountBalance(accountId?: string) {
    return useQuery({
        queryKey: ['hedera', 'balance', accountId],
        queryFn: async () => {
            const params = accountId ? `?accountId=${accountId}` : '';
            const response = await fetch(`/api/hedera/balance${params}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch balance');
            }
            return response.json();
        },
        refetchInterval: 30000, // Refetch every 30 seconds
    });
}

/**
 * Hook to transfer HBAR
 */
export function useTransferHbar() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            recipientId,
            amount,
        }: {
            recipientId: string;
            amount: number;
        }) => {
            const response = await fetch('/api/hedera/transfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipientId, amount }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to transfer HBAR');
            }
            return response.json();
        },
        onSuccess: () => {
            // Invalidate balance queries to refetch
            queryClient.invalidateQueries({ queryKey: ['hedera', 'balance'] });
        },
    });
}

/**
 * Hook to create a fungible token
 */
export function useCreateToken() {
    return useMutation({
        mutationFn: async ({
            name,
            symbol,
            initialSupply,
            decimals,
        }: {
            name: string;
            symbol: string;
            initialSupply: number;
            decimals?: number;
        }) => {
            const response = await fetch('/api/hedera/token/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, symbol, initialSupply, decimals }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create token');
            }
            return response.json();
        },
    });
}

/**
 * Hook to create an NFT collection
 */
export function useCreateNFT() {
    return useMutation({
        mutationFn: async ({
            name,
            symbol,
        }: {
            name: string;
            symbol: string;
        }) => {
            const response = await fetch('/api/hedera/nft/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, symbol }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create NFT');
            }
            return response.json();
        },
    });
}

/**
 * Hook to create a topic
 */
export function useCreateTopic() {
    return useMutation({
        mutationFn: async ({ memo }: { memo?: string }) => {
            const response = await fetch('/api/hedera/topic/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ memo }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create topic');
            }
            return response.json();
        },
    });
}

/**
 * Hook to submit a message to a topic
 */
export function useSubmitMessage() {
    return useMutation({
        mutationFn: async ({
            topicId,
            message,
        }: {
            topicId: string;
            message: string;
        }) => {
            const response = await fetch('/api/hedera/topic/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topicId, message }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to submit message');
            }
            return response.json();
        },
    });
}
