import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlantWidget } from "@/components/harvest/PlantWidget";
import { MOCK_SEASON } from "@/lib/harvest/mockData";
import {
  connectMockWallet,
  resetWalletMock,
  walletModalMock,
} from "./mocks/walletState";

function setup() {
  const onPlantConfirmed = vi.fn();
  render(<PlantWidget season={MOCK_SEASON} onPlantConfirmed={onPlantConfirmed} />);
  return { onPlantConfirmed };
}

afterEach(() => {
  resetWalletMock();
});

describe("PlantWidget amount controls", () => {
  it("defaults to the minimum amount of 50,000", () => {
    setup();
    expect(screen.getByText("50,000")).toBeInTheDocument();
  });

  it("increases by exactly 50,000 on plus", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByLabelText(/increase amount/i));
    expect(screen.getByText("100,000")).toBeInTheDocument();
  });

  it("decreases by exactly 50,000 on minus", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByLabelText(/increase amount/i));
    await user.click(screen.getByLabelText(/decrease amount/i));
    expect(screen.getByText("50,000")).toBeInTheDocument();
  });

  it("never goes below 50,000", async () => {
    const user = userEvent.setup();
    setup();
    const minusButton = screen.getByLabelText(/decrease amount/i);
    expect(minusButton).toBeDisabled();
    await user.click(minusButton);
    expect(screen.getByText("50,000")).toBeInTheDocument();
  });

  it("quick-select buttons set the correct amount", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("button", { name: "250K" }));
    expect(screen.getByText("250,000")).toBeInTheDocument();
  });
});

describe("PlantWidget — disconnected wallet", () => {
  it("shows Connect Wallet", () => {
    setup();
    expect(screen.getByRole("button", { name: /connect wallet/i })).toBeInTheDocument();
  });

  it("clicking Connect Wallet opens the wallet-selection modal and sends no network call", async () => {
    const user = userEvent.setup();
    const setVisibleSpy = vi.spyOn(walletModalMock, "setVisible");
    const fetchSpy = vi.spyOn(global, "fetch" as any).mockImplementation(() => {
      throw new Error("No network calls should occur in Phase 1");
    });

    setup();
    await user.click(screen.getByRole("button", { name: /connect wallet/i }));

    expect(setVisibleSpy).toHaveBeenCalledWith(true);
    expect(fetchSpy).not.toHaveBeenCalled();
    setVisibleSpy.mockRestore();
    fetchSpy.mockRestore();
  });
});

describe("PlantWidget — connected wallet", () => {
  it("shows the Plant action", () => {
    connectMockWallet();
    setup();
    expect(screen.getByRole("button", { name: /plant \$touchgrass/i })).toBeInTheDocument();
  });

  it("Plant never sends a network/blockchain call", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(global, "fetch" as any).mockImplementation(() => {
      throw new Error("No network calls should occur in Phase 1");
    });
    connectMockWallet();
    setup();

    await user.click(screen.getByRole("button", { name: /plant \$touchgrass/i }));
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("confirmation modal shows the selected amount", async () => {
    const user = userEvent.setup();
    connectMockWallet();
    setup();

    await user.click(screen.getByRole("button", { name: "500K" }));
    await user.click(screen.getByRole("button", { name: /plant \$touchgrass/i }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveTextContent("500,000 $TOUCHGRASS");
  });

  it("Confirm Preview calls onPlantConfirmed with the selected amount and sends no network call", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(global, "fetch" as any).mockImplementation(() => {
      throw new Error("No network calls should occur in Phase 1");
    });
    connectMockWallet();
    const { onPlantConfirmed } = setup();

    await user.click(screen.getByRole("button", { name: "100K" }));
    await user.click(screen.getByRole("button", { name: /plant \$touchgrass/i }));
    await user.click(await screen.findByRole("button", { name: /confirm preview/i }));

    expect(onPlantConfirmed).toHaveBeenCalledWith(100_000);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
