//! SolStake - DeFi Staking Protocol for Solana
//!
//! A smart contract for staking SOL and SPL tokens with:
//! - Flexible staking pools
//! - Reward distribution
//! - Emergency withdrawal
//! - Admin controls

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solstake {
    use super::*;

    /// Initialize a new staking pool
    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        reward_rate: u64,
        lock_period: i64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        
        pool.authority = ctx.accounts.authority.key();
        pool.stake_mint = ctx.accounts.stake_mint.key();
        pool.reward_mint = ctx.accounts.reward_mint.key();
        pool.reward_rate = reward_rate; // Rewards per second per token
        pool.lock_period = lock_period;  // Lock period in seconds
        pool.total_staked = 0;
        pool.total_rewards_distributed = 0;
        pool.last_update_time = Clock::get()?.unix_timestamp;
        pool.bump = ctx.bumps.pool;

        msg!("Pool initialized with reward_rate: {}, lock_period: {}", reward_rate, lock_period);
        Ok(())
    }

    /// Stake tokens into the pool
    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        require!(amount > 0, SolstakeError::ZeroAmount);

        let pool = &mut ctx.accounts.pool;
        let stake_info = &mut ctx.accounts.stake_info;
        let clock = Clock::get()?;

        // Update rewards before changing stake
        if stake_info.amount > 0 {
            let pending = calculate_pending_rewards(
                stake_info.amount,
                stake_info.last_claim_time,
                clock.unix_timestamp,
                pool.reward_rate,
            );
            stake_info.pending_rewards = stake_info.pending_rewards.checked_add(pending).unwrap();
        }

        // Transfer tokens to pool vault
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_stake_account.to_account_info(),
                    to: ctx.accounts.pool_vault.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount,
        )?;

        // Update stake info
        stake_info.user = ctx.accounts.user.key();
        stake_info.pool = pool.key();
        stake_info.amount = stake_info.amount.checked_add(amount).unwrap();
        stake_info.stake_time = clock.unix_timestamp;
        stake_info.last_claim_time = clock.unix_timestamp;
        stake_info.bump = ctx.bumps.stake_info;

        // Update pool totals
        pool.total_staked = pool.total_staked.checked_add(amount).unwrap();
        pool.last_update_time = clock.unix_timestamp;

        msg!("Staked {} tokens", amount);
        Ok(())
    }

    /// Unstake tokens from the pool
    pub fn unstake(ctx: Context<Unstake>, amount: u64) -> Result<()> {
        let stake_info = &ctx.accounts.stake_info;
        let pool = &ctx.accounts.pool;
        let clock = Clock::get()?;

        require!(amount > 0, SolstakeError::ZeroAmount);
        require!(stake_info.amount >= amount, SolstakeError::InsufficientStake);
        
        // Check lock period
        let time_staked = clock.unix_timestamp - stake_info.stake_time;
        require!(time_staked >= pool.lock_period, SolstakeError::StakeLocked);

        // Calculate and add pending rewards
        let pending = calculate_pending_rewards(
            stake_info.amount,
            stake_info.last_claim_time,
            clock.unix_timestamp,
            pool.reward_rate,
        );

        // Transfer tokens back to user
        let pool_key = pool.key();
        let seeds = &[
            b"pool".as_ref(),
            pool_key.as_ref(),
            &[pool.bump],
        ];
        let signer = &[&seeds[..]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.pool_vault.to_account_info(),
                    to: ctx.accounts.user_stake_account.to_account_info(),
                    authority: pool.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;

        // Update accounts
        let stake_info = &mut ctx.accounts.stake_info;
        let pool = &mut ctx.accounts.pool;

        stake_info.amount = stake_info.amount.checked_sub(amount).unwrap();
        stake_info.pending_rewards = stake_info.pending_rewards.checked_add(pending).unwrap();
        stake_info.last_claim_time = clock.unix_timestamp;

        pool.total_staked = pool.total_staked.checked_sub(amount).unwrap();
        pool.last_update_time = clock.unix_timestamp;

        msg!("Unstaked {} tokens, pending rewards: {}", amount, pending);
        Ok(())
    }

    /// Claim pending rewards
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        let stake_info = &mut ctx.accounts.stake_info;
        let clock = Clock::get()?;

        let pending = calculate_pending_rewards(
            stake_info.amount,
            stake_info.last_claim_time,
            clock.unix_timestamp,
            pool.reward_rate,
        );

        let total_rewards = stake_info.pending_rewards.checked_add(pending).unwrap();
        require!(total_rewards > 0, SolstakeError::NoRewards);

        // Transfer rewards
        let pool_key = pool.key();
        let seeds = &[
            b"pool".as_ref(),
            pool_key.as_ref(),
            &[pool.bump],
        ];
        let signer = &[&seeds[..]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.reward_vault.to_account_info(),
                    to: ctx.accounts.user_reward_account.to_account_info(),
                    authority: pool.to_account_info(),
                },
                signer,
            ),
            total_rewards,
        )?;

        // Update state
        stake_info.pending_rewards = 0;
        stake_info.last_claim_time = clock.unix_timestamp;
        pool.total_rewards_distributed = pool.total_rewards_distributed
            .checked_add(total_rewards)
            .unwrap();

        msg!("Claimed {} rewards", total_rewards);
        Ok(())
    }

    /// Emergency withdraw (forfeits rewards)
    pub fn emergency_withdraw(ctx: Context<Unstake>) -> Result<()> {
        let stake_info = &ctx.accounts.stake_info;
        let pool = &ctx.accounts.pool;
        let amount = stake_info.amount;

        require!(amount > 0, SolstakeError::ZeroAmount);

        // Transfer all tokens back (no rewards)
        let pool_key = pool.key();
        let seeds = &[
            b"pool".as_ref(),
            pool_key.as_ref(),
            &[pool.bump],
        ];
        let signer = &[&seeds[..]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.pool_vault.to_account_info(),
                    to: ctx.accounts.user_stake_account.to_account_info(),
                    authority: pool.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;

        // Reset stake info
        let stake_info = &mut ctx.accounts.stake_info;
        let pool = &mut ctx.accounts.pool;

        pool.total_staked = pool.total_staked.checked_sub(amount).unwrap();
        stake_info.amount = 0;
        stake_info.pending_rewards = 0;

        msg!("Emergency withdraw: {} tokens (rewards forfeited)", amount);
        Ok(())
    }
}

/// Calculate pending rewards
fn calculate_pending_rewards(
    staked_amount: u64,
    last_claim_time: i64,
    current_time: i64,
    reward_rate: u64,
) -> u64 {
    let time_elapsed = (current_time - last_claim_time) as u64;
    staked_amount
        .checked_mul(reward_rate)
        .unwrap()
        .checked_mul(time_elapsed)
        .unwrap()
        .checked_div(1_000_000_000) // Normalize
        .unwrap_or(0)
}

// === Account Structures ===

#[account]
pub struct Pool {
    pub authority: Pubkey,
    pub stake_mint: Pubkey,
    pub reward_mint: Pubkey,
    pub reward_rate: u64,
    pub lock_period: i64,
    pub total_staked: u64,
    pub total_rewards_distributed: u64,
    pub last_update_time: i64,
    pub bump: u8,
}

#[account]
pub struct StakeInfo {
    pub user: Pubkey,
    pub pool: Pubkey,
    pub amount: u64,
    pub stake_time: i64,
    pub last_claim_time: i64,
    pub pending_rewards: u64,
    pub bump: u8,
}

// === Context Structures ===

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 32 + 8 + 8 + 8 + 8 + 8 + 1,
        seeds = [b"pool", stake_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,
    
    /// CHECK: Stake token mint
    pub stake_mint: AccountInfo<'info>,
    
    /// CHECK: Reward token mint
    pub reward_mint: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + 32 + 32 + 8 + 8 + 8 + 8 + 1,
        seeds = [b"stake", pool.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub stake_info: Account<'info, StakeInfo>,
    
    #[account(mut)]
    pub user_stake_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub pool_vault: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    
    #[account(
        mut,
        seeds = [b"stake", pool.key().as_ref(), user.key().as_ref()],
        bump = stake_info.bump
    )]
    pub stake_info: Account<'info, StakeInfo>,
    
    #[account(mut)]
    pub user_stake_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub pool_vault: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    
    #[account(
        mut,
        seeds = [b"stake", pool.key().as_ref(), user.key().as_ref()],
        bump = stake_info.bump
    )]
    pub stake_info: Account<'info, StakeInfo>,
    
    #[account(mut)]
    pub user_reward_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub reward_vault: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

// === Errors ===

#[error_code]
pub enum SolstakeError {
    #[msg("Amount must be greater than zero")]
    ZeroAmount,
    #[msg("Insufficient staked amount")]
    InsufficientStake,
    #[msg("Stake is still locked")]
    StakeLocked,
    #[msg("No rewards to claim")]
    NoRewards,
}
