/**
 * SolStake SDK
 *
 * TypeScript SDK for interacting with the SolStake DeFi protocol on Solana.
 */

import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    TransactionInstruction,
    SystemProgram,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js";

// Program ID (replace with deployed program ID)
export const PROGRAM_ID = new PublicKey(
    "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"
);

// === Types ===

export interface Pool {
    authority: PublicKey;
    stakeMint: PublicKey;
    rewardMint: PublicKey;
    rewardRate: bigint;
    lockPeriod: bigint;
    totalStaked: bigint;
    totalRewardsDistributed: bigint;
    lastUpdateTime: bigint;
    bump: number;
}

export interface StakeInfo {
    user: PublicKey;
    pool: PublicKey;
    amount: bigint;
    stakeTime: bigint;
    lastClaimTime: bigint;
    pendingRewards: bigint;
    bump: number;
}

export interface PoolConfig {
    stakeMint: PublicKey;
    rewardMint: PublicKey;
    rewardRate: number;
    lockPeriod: number; // in seconds
}

// === Client Class ===

export class SolStakeClient {
    connection: Connection;
    programId: PublicKey;

    constructor(
        connection: Connection,
        programId: PublicKey = PROGRAM_ID
    ) {
        this.connection = connection;
        this.programId = programId;
    }

    /**
     * Find the PDA for a pool
     */
    async findPoolAddress(stakeMint: PublicKey): Promise<[PublicKey, number]> {
        return PublicKey.findProgramAddressSync(
            [Buffer.from("pool"), stakeMint.toBuffer()],
            this.programId
        );
    }

    /**
     * Find the PDA for a user's stake info
     */
    async findStakeInfoAddress(
        pool: PublicKey,
        user: PublicKey
    ): Promise<[PublicKey, number]> {
        return PublicKey.findProgramAddressSync(
            [Buffer.from("stake"), pool.toBuffer(), user.toBuffer()],
            this.programId
        );
    }

    /**
     * Fetch pool data
     */
    async getPool(poolAddress: PublicKey): Promise<Pool | null> {
        const accountInfo = await this.connection.getAccountInfo(poolAddress);
        if (!accountInfo) return null;

        // In production, deserialize with Borsh or Anchor
        return this.deserializePool(accountInfo.data);
    }

    /**
     * Fetch stake info for a user
     */
    async getStakeInfo(stakeInfoAddress: PublicKey): Promise<StakeInfo | null> {
        const accountInfo = await this.connection.getAccountInfo(stakeInfoAddress);
        if (!accountInfo) return null;

        return this.deserializeStakeInfo(accountInfo.data);
    }

    /**
     * Calculate pending rewards
     */
    calculatePendingRewards(stakeInfo: StakeInfo, pool: Pool): bigint {
        const now = BigInt(Math.floor(Date.now() / 1000));
        const timeElapsed = now - stakeInfo.lastClaimTime;

        const rewards =
            (stakeInfo.amount * pool.rewardRate * timeElapsed) / BigInt(1e9);

        return stakeInfo.pendingRewards + rewards;
    }

    /**
     * Get APY for a pool
     */
    calculateAPY(pool: Pool): number {
        const secondsPerYear = 365 * 24 * 60 * 60;
        const rewardPerYear =
            Number(pool.rewardRate) * secondsPerYear / 1e9;

        if (Number(pool.totalStaked) === 0) return 0;

        return (rewardPerYear / Number(pool.totalStaked)) * 100;
    }

    /**
     * Estimate gas for stake transaction
     */
    async estimateStakeGas(): Promise<number> {
        // Approximate Solana transaction cost
        return 5000; // lamports
    }

    // === Instruction Builders ===

    /**
     * Build initialize pool instruction
     */
    buildInitializePoolIx(
        authority: PublicKey,
        pool: PublicKey,
        stakeMint: PublicKey,
        rewardMint: PublicKey,
        rewardRate: bigint,
        lockPeriod: bigint
    ): TransactionInstruction {
        // Build instruction data
        const data = Buffer.alloc(24);
        data.writeUInt8(0, 0); // Instruction index: initialize
        data.writeBigUInt64LE(rewardRate, 8);
        data.writeBigInt64LE(lockPeriod, 16);

        return new TransactionInstruction({
            keys: [
                { pubkey: authority, isSigner: true, isWritable: true },
                { pubkey: pool, isSigner: false, isWritable: true },
                { pubkey: stakeMint, isSigner: false, isWritable: false },
                { pubkey: rewardMint, isSigner: false, isWritable: false },
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
            ],
            programId: this.programId,
            data,
        });
    }

    /**
     * Build stake instruction
     */
    buildStakeIx(
        user: PublicKey,
        pool: PublicKey,
        stakeInfo: PublicKey,
        userStakeAccount: PublicKey,
        poolVault: PublicKey,
        tokenProgram: PublicKey,
        amount: bigint
    ): TransactionInstruction {
        const data = Buffer.alloc(16);
        data.writeUInt8(1, 0); // Instruction index: stake
        data.writeBigUInt64LE(amount, 8);

        return new TransactionInstruction({
            keys: [
                { pubkey: user, isSigner: true, isWritable: true },
                { pubkey: pool, isSigner: false, isWritable: true },
                { pubkey: stakeInfo, isSigner: false, isWritable: true },
                { pubkey: userStakeAccount, isSigner: false, isWritable: true },
                { pubkey: poolVault, isSigner: false, isWritable: true },
                { pubkey: tokenProgram, isSigner: false, isWritable: false },
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
            ],
            programId: this.programId,
            data,
        });
    }

    // === Helper Methods ===

    private deserializePool(data: Buffer): Pool {
        // Skip 8-byte discriminator
        let offset = 8;

        return {
            authority: new PublicKey(data.subarray(offset, (offset += 32))),
            stakeMint: new PublicKey(data.subarray(offset, (offset += 32))),
            rewardMint: new PublicKey(data.subarray(offset, (offset += 32))),
            rewardRate: data.readBigUInt64LE((offset += 0), (offset += 8) && offset - 8),
            lockPeriod: data.readBigInt64LE(offset - 8 + 8),
            totalStaked: data.readBigUInt64LE(offset),
            totalRewardsDistributed: data.readBigUInt64LE(offset + 8),
            lastUpdateTime: data.readBigInt64LE(offset + 16),
            bump: data.readUInt8(offset + 24),
        };
    }

    private deserializeStakeInfo(data: Buffer): StakeInfo {
        let offset = 8;

        return {
            user: new PublicKey(data.subarray(offset, offset + 32)),
            pool: new PublicKey(data.subarray(offset + 32, offset + 64)),
            amount: data.readBigUInt64LE(offset + 64),
            stakeTime: data.readBigInt64LE(offset + 72),
            lastClaimTime: data.readBigInt64LE(offset + 80),
            pendingRewards: data.readBigUInt64LE(offset + 88),
            bump: data.readUInt8(offset + 96),
        };
    }
}

// === Utility Functions ===

/**
 * Format lamports to SOL
 */
export function lamportsToSol(lamports: bigint): number {
    return Number(lamports) / LAMPORTS_PER_SOL;
}

/**
 * Format SOL to lamports
 */
export function solToLamports(sol: number): bigint {
    return BigInt(Math.floor(sol * LAMPORTS_PER_SOL));
}

/**
 * Format duration in seconds to human readable
 */
export function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
}

export default SolStakeClient;
