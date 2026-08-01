import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import type { AnchorWallet } from "@solana/wallet-adapter-react";
import idl from "./idl/harvest_program.json";

export const PROGRAM_ID = new PublicKey("Gxcx3EpjGvw6rv2FWSCxkcrfhT4N919phYbNnYCbarZr");

// Devnet for now — this is the one line that changes when we eventually
// point the frontend at mainnet.
export const DEVNET_RPC = "https://api.devnet.solana.com";

export function getConnection(): Connection {
  return new Connection(DEVNET_RPC, "confirmed");
}

export function getProgram(wallet: AnchorWallet | undefined) {
  if (!wallet) return null;

  const connection = getConnection();
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  return new anchor.Program(idl as anchor.Idl, provider);
}

export function seasonConfigPda(seasonId: number): [PublicKey, number] {
  const seasonIdBuf = new anchor.BN(seasonId).toArrayLike(Buffer, "le", 8);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("season"), seasonIdBuf],
    PROGRAM_ID
  );
}

export function plantPositionPda(seasonId: number, planter: PublicKey): [PublicKey, number] {
  const seasonIdBuf = new anchor.BN(seasonId).toArrayLike(Buffer, "le", 8);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("position"), seasonIdBuf, planter.toBuffer()],
    PROGRAM_ID
  );
}

export function escrowAuthorityPda(seasonId: number, planter: PublicKey): [PublicKey, number] {
  const seasonIdBuf = new anchor.BN(seasonId).toArrayLike(Buffer, "le", 8);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("escrow_authority"), seasonIdBuf, planter.toBuffer()],
    PROGRAM_ID
  );
}

export function escrowTokenPda(seasonId: number, planter: PublicKey): [PublicKey, number] {
  const seasonIdBuf = new anchor.BN(seasonId).toArrayLike(Buffer, "le", 8);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("escrow_token"), seasonIdBuf, planter.toBuffer()],
    PROGRAM_ID
  );
}
