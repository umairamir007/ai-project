import {
  AllUsersEmailsResponse,
  SendFundsResponse,
  TokenAsset,
  UserDetailsResponse,
  UserPortfolioResponse,
} from "./DTO";
import {
  BadGateWayError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../utils/AppError";
import User from "../../models/userModel";

import {
  ADMIN_EMAIL,
  APP_CONNECTION,
  GASLESS_RELAYER,
  NATIVE_MINT,
  PROTOCOL_FEES,
  SPL_TOKEN_PROGRAM_ID,
  STABLE_COINS,
} from "../../constants";
import {
  ComputeBudgetProgram,
  Keypair,
  LAMPORTS_PER_SOL,
  ParsedInstruction,
  ParsedTransactionWithMeta,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionMessage,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { decryptPrivateKey } from "../../utils/encryption";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import {
  AccountLayout,
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { WSOLMint } from "@raydium-io/raydium-sdk-v2";
import { fetchTokenAccountData } from "../../utils/raydiumUtils";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { _createNewTransaction } from "../TxHistory/txHistoryService";
import { ITransactionHistory } from "../../models/txHistoryModel";
import mongoose from "mongoose";

// ✅ Get User Details Service
export const getUserDetailsService = async (
  userId: string
): Promise<UserDetailsResponse> => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found.");

  const role = user.email === ADMIN_EMAIL ? "Admin" : (user.role ?? "User");

  return {
    message: "User details fetched successfully.",
    user: {
      name: user.name,
      email: user.email,
      walletAddress: user.solanaWallet ? user.solanaWallet.address : null,
      role
    },
  };
};

export const getUserPortfolioService = async (
  userId: string
): Promise<UserPortfolioResponse> => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found.");

  // const walletAddress = "F8UrBLV3wgc2DSMqRPH88mQyqSnyAkt9uEwf1SNPzXTL";
  const walletAddress = user.solanaWallet?.address;
  if (!walletAddress) {
    throw new NotFoundError("Wallet does not exist.");
  }
  const wallet = new PublicKey(walletAddress);

  // const decryptedPrivateKey = decryptPrivateKey(
  //   user.solanaWallet.encryptedPrivateKey
  // );
  // console.log("🚀 ~ decryptedPrivateKey:", decryptedPrivateKey)

  // --- 1. Fetch stablecoin balances ---
  const stableAssets: TokenAsset[] = STABLE_COINS.map((meta) => ({
    mint: meta.tokenAddress, // Using tokenAddress from the array
    name: meta.name,
    decimals: meta.decimals,
    symbol: meta.symbol,
    image: meta.image,
    balance: 0,
  }));

  const tokenAccounts = await APP_CONNECTION.getTokenAccountsByOwner(wallet, {
    programId: new PublicKey(SPL_TOKEN_PROGRAM_ID),
  });

  // Update balances based on fetched token accounts
  tokenAccounts.value.forEach(({ account }) => {
    const { mint, amount } = _parseTokenAccountData(account.data);

    // Find the corresponding stable coin and update its balance
    const stableCoin = stableAssets.find(
      (asset) => asset.mint.toLowerCase() === mint.toLowerCase()
    );
    if (stableCoin) {
      stableCoin.balance = Number(amount) / 10 ** stableCoin.decimals;
    }
  });

  return {
    message: "User portfolio and full transaction history fetched.",
    assets: stableAssets,
  };
};

export const getAllUsersEmailsService = async (
  userId: string
): Promise<AllUsersEmailsResponse> => {
  if (!mongoose.isValidObjectId(userId)) {
    throw new ValidationError("Invalid user ID.");
  }

  const users = await User.find(
    {
      _id: { $ne: userId },
      "isVerified": true,
    },
    "email"
  ).lean();

  const emails = users.map(user => user.email);

  return {
    message: "All emails fetched successfully.",
    emails,
  };
};

function _parseTokenAccountData(data: Buffer): {
  mint: string;
  amount: string;
} {
  const parsed = AccountLayout.decode(data);
  return {
    mint: new PublicKey(parsed.mint).toBase58(),
    amount: BigInt(parsed.amount).toString(),
  };
}

const _fetchSolToUsdcRate = async () => {
  const response = await axios.get(
    //TODO: jupiter api
    "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
  );
  const data = response.data as any;
  if (!data.solana.usd) throw new NotFoundError("Could not fetch prices.");
  return Number(data.solana.usd); // This gets the SOL price in USD
};

export const _calculateTransactionCostInUsdc = async (
  transactionCostInSol: number
) => {
  const solToUsdcRate = await _fetchSolToUsdcRate();
  console.log("🚀 ~ Sol to USDC rate:", solToUsdcRate); //TODO: assuming same rates for all stabele coins

  // Convert the cost from SOL to USDC
  const costInUsdc = transactionCostInSol * solToUsdcRate;
  console.log("🚀 ~ Transaction cost in USDC:", costInUsdc);
  return costInUsdc;
};

export const sendFundsService = async (
  userId: string,
  tokenAddress: string, // Token address (if sending SPL token or SOL)
  amount: number, // Amount to send
  recipientEmail: string, // Recipient wallet address
  description: string, // tx description
  invoiceId?: string // if paying an invoice
): Promise<SendFundsResponse> => {
  const stableCoin = STABLE_COINS.find(
    (coin) => coin.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
  );

  if (!stableCoin) {
    throw new ConflictError(
      "Invalid token address. Only supported stable coins are allowed."
    );
  }

  // Fetch senderWalletData and wallet details
  const senderWalletData = await User.findById(userId);
  if (!senderWalletData || !senderWalletData.solanaWallet?.address) {
    throw new NotFoundError("Sender account does not exist.");
  }
  const recipientWalletData = await User.findOne({ email: recipientEmail });
  if (!recipientWalletData || !recipientWalletData.solanaWallet?.address) {
    throw new NotFoundError("Recipient account does not exist.");
  }

  const decryptedPrivateKey = decryptPrivateKey(
    senderWalletData.solanaWallet.encryptedPrivateKey
  );

  // const decryptedPrivateKey = TEST_ACCOUNT_1.pvtKey;

  const senderWallet: Keypair = Keypair.fromSecretKey(
    bs58.decode(decryptedPrivateKey)
  );

  const res = await fetchTokenAccountData(senderWallet.publicKey);

  const balance = res.tokenAccounts.find(
    (a) => a.mint.toBase58() === tokenAddress
  )?.amount;

  const mint: any = await APP_CONNECTION.getParsedAccountInfo(
    new PublicKey(tokenAddress)
  );

  const tokenDecimals = mint.value.data.parsed.info.decimals;

  if (!balance || balance.isZero())
    throw new ValidationError("you do not have enough balance");

  const recipientPubkey = new PublicKey(
    recipientWalletData.solanaWallet.address
  );
  const _mintAddress = new PublicKey(tokenAddress);

  // Get the token account of the fromWallet Solana address, if it does not exist, create it
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    APP_CONNECTION,
    GASLESS_RELAYER, //payer
    _mintAddress,
    senderWallet.publicKey
  );
  //get the token account of the toWallet Solana address, if it does not exist, create it
  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    APP_CONNECTION,
    GASLESS_RELAYER, //payer
    _mintAddress,
    recipientPubkey
  );
  //get the token account of the relayer Solana address, if it does not exist, create it
  const relayerTokenAccount = await getOrCreateAssociatedTokenAccount(
    APP_CONNECTION,
    GASLESS_RELAYER, //payer
    _mintAddress,
    GASLESS_RELAYER.publicKey
  );

  const amountToSend = Math.floor(amount * 10 ** tokenDecimals);
  if (amountToSend <= 0) {
    throw new ConflictError(`Invalid amount ${amount}`);
  }
  // const dummyUSDCAmount = Math.floor(0.00154 * 10 ** tokenDecimals);
  const protocolFees = amountToSend * PROTOCOL_FEES;
  const protocolFeesInSmallerUnits = Math.floor(protocolFees * 10 ** tokenDecimals);
  const transactionSimulate = new Transaction({
    feePayer: GASLESS_RELAYER.publicKey,
  });


  transactionSimulate.add(
    createTransferInstruction(
      fromTokenAccount.address,
      toTokenAccount.address,
      senderWallet.publicKey,
      amountToSend
    )
  );

  transactionSimulate.add(
    createTransferInstruction(
      fromTokenAccount.address,
      relayerTokenAccount.address,
      senderWallet.publicKey,
      protocolFeesInSmallerUnits
    )
  );

  // Refresh the blockhash before sending
  const { blockhash, lastValidBlockHeight } =
    await APP_CONNECTION.getLatestBlockhash();

  // Fetch the transaction fee for the message
  const messageV0 = new TransactionMessage({
    payerKey: GASLESS_RELAYER.publicKey,
    recentBlockhash: blockhash,
    instructions: transactionSimulate.instructions,
  }).compileToV0Message();

  const fees = await APP_CONNECTION.getFeeForMessage(messageV0);

  const txFeeInSol = fees.value / LAMPORTS_PER_SOL;
  const feeInUsdc = await _calculateTransactionCostInUsdc(txFeeInSol);
  const feeInUsdcFinal = Math.ceil((feeInUsdc + protocolFees) * 10 ** tokenDecimals);

  const totalAmount = amountToSend + feeInUsdcFinal;
  const senderBalance = Number(balance);
  if (totalAmount > senderBalance)
    throw new ValidationError("Amount to be sent is greater than your balance");

  const transactionExecutable = new Transaction({
    feePayer: GASLESS_RELAYER.publicKey,
  });

  transactionExecutable.add(
    createTransferInstruction(
      fromTokenAccount.address,
      toTokenAccount.address,
      senderWallet.publicKey,
      amountToSend
    )
  );

  transactionExecutable.add(
    createTransferInstruction(
      fromTokenAccount.address,
      relayerTokenAccount.address,
      senderWallet.publicKey,
      feeInUsdcFinal
    )
  );

  // Update the blockhash of the transaction with the latest one
  transactionExecutable.recentBlockhash = blockhash;
  transactionExecutable.lastValidBlockHeight = lastValidBlockHeight;

  // Send the transactionExecutable
  const signature = await sendAndConfirmTransaction(
    APP_CONNECTION,
    transactionExecutable,
    [GASLESS_RELAYER, senderWallet],
    {
      commitment: "confirmed",
    }
  );

  console.log(`https://solscan.io/tx/${signature}`);

  const newTx: ITransactionHistory = {
    senderId: senderWalletData._id, // Reference to the sender user
    transactions: [
      {
        recipientId: recipientWalletData._id, // Reference to the recipient user
        amount: amount,
      },
    ],
    currency: { address: stableCoin.tokenAddress, symbol: stableCoin.symbol },
    transactionHash: signature,
    timestamp: new Date(),
    totalAmount: amount,
    gasFees: feeInUsdc,
    fee: protocolFees,
    description: description,
  };

  await _createNewTransaction(newTx, invoiceId);

  return {
    message: "Funds transfer successfully.",
    txHash: signature,
  };
};
