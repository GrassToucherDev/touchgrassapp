import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
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
    render(<HarvestPageContent />);

    expect(screen.getByText(/haven't planted this season yet/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "250K" }));
    await user.click(screen.getByRole("button", { name: /plant \$touchgrass/i }));
    await user.click(await screen.findByRole("button", { name: /confirm preview/i }));

    // Appears in both the Position card and the Receipt preview card.
    expect(screen.getAllByText(/250,000 \$TOUCHGRASS/).length).toBeGreaterThan(0);
  });
});

describe("HarvestPageContent — narrow viewport smoke test", () => {
  // jsdom does not lay out CSS, so this cannot catch real overflow the way
  // a browser/Playwright test would — it only confirms the page renders
  // cleanly with a mobile viewport size set. Recommend adding a
  // Playwright viewport test (375px) for true horizontal-overflow coverage.
  it("renders without throwing at a 375px viewport", () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event("resize"));
    const { container } = render(<HarvestPageContent />);
    expect(container.querySelector("#top")).toBeInTheDocument();
  });
});
