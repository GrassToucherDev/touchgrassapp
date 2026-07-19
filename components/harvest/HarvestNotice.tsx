export function HarvestNotice() {
  return (
    <div className="mt-6 rounded-xl3 border-2 border-sun/40 bg-sun/10 p-5 sm:p-6">
      <p className="font-display font-bold text-ink">
        Your planted $TOUCHGRASS principal is returned in full after Harvest Day. Seasonal
        rewards are distributed separately and are never taken from the principal vault.
      </p>
      <p className="mt-2 text-sm font-semibold text-harvest-dark">
        No early withdrawal during the active season.
      </p>
    </div>
  );
}
