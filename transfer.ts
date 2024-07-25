import { Transaction, SystemProgram, Connection, Keypair, LAMPORTS_PER_SOL, sendAndConfirmTransaction, PublicKey } from "@solana/web3.js";
import wallet from "./dev-wallet.json";
import { DEVNET_RPC_URL } from "./constants";

// TODO: Probably better to put this in a secret or ENV variable
const WBA_DEVNET_WALLET_ADDRESS = "FyScGJc8PWZGs2XVTZyNdkDyfKmiyvKLuuAUxiHAPPKL";

try {
  const from = Keypair.fromSecretKey(new Uint8Array(wallet));
  const to = new PublicKey(WBA_DEVNET_WALLET_ADDRESS);
  const connection = new Connection(DEVNET_RPC_URL);

  const transfer = async () => {
    try {
      const transaction = new Transaction();
      const solToTransfer = 0.1;

      transaction.add(
        SystemProgram.transfer(
          {
            fromPubkey: from.publicKey,
            toPubkey: to,
            lamports: solToTransfer * LAMPORTS_PER_SOL
          }
        )
      );

      const { blockhash } = await connection.getLatestBlockhash("confirmed");
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = from.publicKey;

      const signature = await sendAndConfirmTransaction(connection, transaction, [from]);
      console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (err) {
      console.error(`Failed to transfer tokens from ${from.publicKey.toString()} to ${to.toString()}: ${err}`);
    }
  }

  transfer();
} catch (err) {
  console.log("Failed to run transfer tokens program: ", err);
}
