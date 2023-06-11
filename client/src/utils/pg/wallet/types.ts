import type {
  Keypair,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import type {
  Adapter,
  MessageSignerWalletAdapterProps,
  SignerWalletAdapterProps,
  WalletAdapterProps,
} from "@solana/wallet-adapter-base";
import type { Wallet as SolanaWallet } from "@solana/wallet-adapter-react";

/** Wallet state */
export interface Wallet {
  /** Wallet connection state */
  state: "setup" | "disconnected" | "pg" | "sol";
  /** All accounts */
  accounts: Array<{
    /**
     * ed25519 keypair of the account.
     *
     * First 32 bytes are the private key, last 32 bytes are the public key.
     */
    kp: Array<number>;
    /** Name of the account */
    name: string;
  }>;
  /** Current wallet index */
  currentIndex: number;
  /** Balance of the current wallet, `null` by default */
  balance: number | null;
  /** Whether to show the `Wallet` component */
  show: boolean;
  /** Wallet Standard wallets */
  standardWallets: SolanaWallet[];
  /** Name of the standard wallet */
  standardName: string | null;
}

/** Serialized wallet that's used in storage */
export type SerializedWallet = Pick<
  Wallet,
  "state" | "accounts" | "currentIndex" | "standardName"
>;

/** Legacy or versioned transaction */
export type AnyTransaction = Transaction | VersionedTransaction;

/**
 * The current wallet which can be a Playground Wallet, a Wallet Standard Wallet
 * or `null` if disconnected.
 */
export type CurrentWallet = (PgWalletProps | StandardWalletProps) | null;

/** Wallet Standard wallet */
export type StandardWallet = StandardWalletProps | Adapter | null;

/** Playground Wallet props */
export interface PgWalletProps extends DefaultWalletProps {
  /** The wallet is Playground Wallet */
  isPg: true;
  /** Keypair of the Playground Wallet */
  keypair: Keypair;
}

/** All wallets other than Playground Wallet */
export interface StandardWalletProps
  extends DefaultWalletProps,
    DefaultAdapter {
  /** The wallet is not Playground Wallet */
  isPg: false;
}

/** Wallet adapter without `publicKey` prop */
type DefaultAdapter = Omit<WalletAdapterProps, "publicKey">;

/** Common props for both Playground Wallet and other wallets */
type DefaultWalletProps<PublicKeyProp = Pick<WalletAdapterProps, "publicKey">> =
  Pick<
    SignerWalletAdapterProps & MessageSignerWalletAdapterProps,
    "signMessage" | "signTransaction" | "signAllTransactions"
  > & {
    [K in keyof PublicKeyProp]: NonNullable<PublicKeyProp[K]>;
  };

/** Optional `wallet` prop */
export interface WalletOption {
  /** Wallet to use */
  wallet?: NonNullable<CurrentWallet>;
}
