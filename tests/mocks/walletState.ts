export interface MockPublicKey {
  toBase58: () => string;
}

export const walletMockState: {
  publicKey: MockPublicKey | null;
  connected: boolean;
  connecting: boolean;
  disconnect: () => Promise<void>;
} = {
  publicKey: null,
  connected: false,
  connecting: false,
  disconnect: async () => {},
};

export const walletModalMock: { setVisible: (visible: boolean) => void } = {
  setVisible: () => {},
};

export const DEFAULT_MOCK_ADDRESS = "8fQ2xVq3kD9pRzT1mNc7Ls4vHj6Yb2Wk1RpXeUt5oGkR";

export function connectMockWallet(address: string = DEFAULT_MOCK_ADDRESS) {
  walletMockState.connected = true;
  walletMockState.connecting = false;
  walletMockState.publicKey = { toBase58: () => address };
}

export function disconnectMockWallet() {
  walletMockState.connected = false;
  walletMockState.publicKey = null;
}

export function resetWalletMock() {
  disconnectMockWallet();
  walletMockState.connecting = false;
}
