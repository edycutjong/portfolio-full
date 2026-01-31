# SolStake Protocol

DeFi staking protocol built on Solana with Anchor framework.

## Features

- 🔒 **Flexible Staking Pools** - Create pools with custom reward rates
- 💰 **Reward Distribution** - Time-based reward calculation
- ⏰ **Lock Periods** - Configurable staking lock times
- 🚨 **Emergency Withdraw** - Safety feature (forfeits rewards)
- 📊 **TypeScript SDK** - Full client library

## Tech Stack

- **Smart Contract**: Rust + Anchor 0.29
- **Blockchain**: Solana
- **SDK**: TypeScript + @solana/web3.js
- **Testing**: solana-program-test

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Pool                          │
├─────────────────────────────────────────────────┤
│ - authority (admin)                             │
│ - stake_mint (token to stake)                   │
│ - reward_mint (token for rewards)               │
│ - reward_rate (rewards per second per token)    │
│ - lock_period (seconds before unstake)          │
│ - total_staked                                  │
└─────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│                StakeInfo (per user)             │
├─────────────────────────────────────────────────┤
│ - user                                          │
│ - pool                                          │
│ - amount                                        │
│ - stake_time                                    │
│ - last_claim_time                               │
│ - pending_rewards                               │
└─────────────────────────────────────────────────┘
```

## Instructions

| Instruction | Description |
|-------------|-------------|
| `initialize_pool` | Create a new staking pool |
| `stake` | Deposit tokens into pool |
| `unstake` | Withdraw tokens (after lock) |
| `claim_rewards` | Claim accumulated rewards |
| `emergency_withdraw` | Withdraw immediately (no rewards) |

## Getting Started

### Smart Contract

```bash
# Build (requires Anchor CLI)
anchor build

# Test
anchor test

# Deploy
anchor deploy
```

### TypeScript SDK

```bash
cd solstake-sdk
bun install
bun run build
```

### Usage

```typescript
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { SolStakeClient, lamportsToSol } from "@portfolio/solstake-sdk";

// Connect to devnet
const connection = new Connection(clusterApiUrl("devnet"));
const client = new SolStakeClient(connection);

// Find pool address
const [poolAddress] = await client.findPoolAddress(stakeMint);

// Get pool info
const pool = await client.getPool(poolAddress);
console.log("Total staked:", lamportsToSol(pool.totalStaked), "SOL");

// Calculate APY
const apy = client.calculateAPY(pool);
console.log("APY:", apy.toFixed(2), "%");
```

## Project Structure

```
apps/
├── solstake-protocol/         # Rust smart contract
│   ├── Cargo.toml
│   └── src/
│       └── lib.rs             # Anchor program
└── solstake-sdk/              # TypeScript SDK
    ├── package.json
    └── src/
        └── index.ts           # Client library
```

## Security Considerations

- Uses PDAs for account derivation
- Overflow checks on all arithmetic
- Lock period enforcement
- Authority checks on admin functions

## License

MIT
