import { afterEach, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HarvestPageContent } from "@/components/harvest/HarvestPageContent";
import { connectMockWallet, resetWalletMock } from "./mocks/walletState";

afterEach(() => {
  resetWalletMock();
});

describe("HarvestPageContent — Plant preview flow", () => {
  it("Confirm Preview populates the My Position card with the selected amount", async () => {
    const user = userEvent.setup();
    connectMockWallet();
    const { container } = render(<HarvestPageContent />);

    expect(screen.getByText(/haven't planted this season yet/i)).toBeInTheDocument();

    // Scope to the Plant widget specifically — the hero section has its
    // own "Plant $TOUCHGRASS" scroll button with the same accessible name.
    const plantSection = container.querySelector("#plant") as HTMLElement;
    const widget = within(plantSection);

    await user.click(widget.getByRole("button", { name: "250K" }));
    await user.click(widget.getByRole("button", { name: /plant \$touchgrass/i }));
    await user.click(await widget.findByRole("button", { name: /confirm preview/i }));

    expect(screen.getAllByText(/250,000 \$TOUCHGRASS/).length).toBeGreaterThan(0);
  });
});

describe("HarvestPageContent — narrow viewport smoke test", () => {
  it("renders without throwing at a 375px viewport", () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event("resize"));
    const { container } = render(<HarvestPageContent />);
    expect(container.querySelector("#top")).toBeInTheDocument();
  });
});
