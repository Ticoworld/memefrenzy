// src/config.ts
export const CONFIG = {
  MIN_STAKE_AMOUNT: 100000, // Updated to 100K $MEME
  MIN_LOCK_DURATION_DAYS: 30,
  STAKE_POOL_PROGRAM_ID: import.meta.env.VITE_STAKE_POOL_PROGRAM_ID,
  MEME_MINT_ADDRESS: import.meta.env.VITE_MEME_MINT_ADDRESS,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "/api",
  QUICKNODE_API_KEY: import.meta.env.VITE_QUICKNODE_API_KEY,
  CAMPAIGN_END_DATE: "2025-07-13T13:10:00Z",
  TOKEN_DECIMALS: 6,
  SOLANA_RPC_URL:
    import.meta.env.VITE_SOLANA_RPC_URL ||
    "https://api.mainnet-beta.solana.com",
};
