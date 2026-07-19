import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { walletMockState, walletModalMock } from "./tests/mocks/walletState";

if (typeof global.fetch === "undefined") {
  global.fetch = () => Promise.reject(new Error("fetch not implemented in test env"));
}

// The app talks to the real Solana wallet-adapter libraries, which expect a
// browser wallet extension to be present. In tests we replace them with a
// controllable mock (see tests/mocks/walletState.ts) so components can be
// rendered without a Provider tree or a real wallet.
vi.mock("@solana/wallet-adapter-react", () => ({
  useWallet: () => walletMockState,
  ConnectionProvider: ({ children }: { children: React.ReactNode }) => children,
  WalletProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@solana/wallet-adapter-react-ui", () => ({
  useWalletModal: () => walletModalMock,
  WalletModalProvider: ({ children }: { children: React.ReactNode }) => children,
}));
