"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { buildHarvestCaption, daysUntilHarvest, countdownSubline } from "@/lib/harvest/countdown";
import { renderHarvestShareCard } from "@/lib/harvest/shareCard";

interface Props {
  /** Whole $TOUCHGRASS currently planted by the connected wallet (0 / undefined if none). */
  plantedAmount?: number;
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function ShareHarvest({ plantedAmount = 0 }: Props) {
  const hasPosition = plantedAmount > 0;
  const [days, setDays] = useState<number>(() => daysUntilHarvest());
  const [includeAmount, setIncludeAmount] = useState(true);
  const [caption, setCaption] = useState("");
  const [captionEdited, setCaptionEdited] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);

  // Build the preview (and keep it fresh across midnight / tab revisits).
  const refreshPreview = useCallback(async () => {
    const d = daysUntilHarvest();
    setDays(d);
    try {
      const blob = await renderHarvestShareCard(d);
      const url = URL.createObjectURL(blob);
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      previewRef.current = url;
      setPreviewUrl(url);
    } catch {
      setPreviewUrl(null);
    }
  }, []);

  useEffect(() => {
    void refreshPreview();
    const onVisible = () => {
      if (document.visibilityState === "visible" && daysUntilHarvest() !== days) void refreshPreview();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshPreview]);

  // Caption follows the countdown + position unless the user has edited it.
  useEffect(() => {
    if (!captionEdited) setCaption(buildHarvestCaption({ days, plantedAmount, includeAmount }));
  }, [days, plantedAmount, includeAmount, captionEdited]);

  async function handleShare() {
    setBusy(true);
    setNote(null);
    try {
      // Always regenerate from "now" so the image, caption and countdown agree.
      const d = daysUntilHarvest();
      setDays(d);
      const text = captionEdited ? caption : buildHarvestCaption({ days: d, plantedAmount, includeAmount });
      const blob = await renderHarvestShareCard(d);
      const file = new File([blob], `harvest-${d}-days.png`, { type: "image/png" });

      // Best case on phones: native share sheet with the image attached (pick X there).
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text });
          return;
        } catch (e) {
          if ((e as DOMException)?.name === "AbortError") return;
        }
      }

      // Fallback: save the image, copy the caption, open X's composer.
      download(blob, file.name);
      const copied = await copyText(text);
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      setNote(
        copied
          ? "Image saved and caption copied. Attach the image in X, then post."
          : "Image saved. Copy the caption below, then attach the image in X."
      );
    } catch {
      setNote("Couldn't create the image. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSave() {
    setNote(null);
    try {
      const d = daysUntilHarvest();
      download(await renderHarvestShareCard(d), `harvest-${d}-days.png`);
    } catch {
      setNote("Couldn't create the image. Please try again.");
    }
  }

  async function handleCopy() {
    setNote((await copyText(caption)) ? "Caption copied." : "Couldn't copy. Select the text and copy it manually.");
  }

  return (
    <Card id="share" className="space-y-4" aria-labelledby="share-harvest-heading">
      <div>
        <h2 id="share-harvest-heading" className="font-display text-2xl font-bold text-field">
          Share your Harvest
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Show the community how close Harvest is. Come back any day for a fresh card with the new countdown.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl2 bg-sky/60">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={`${days <= 0 ? "Harvest Day" : countdownSubline(days).toLowerCase()}, planting closed`}
            className="block h-auto w-full"
            width={1600}
            height={900}
          />
        ) : (
          <div className="flex aspect-video items-center justify-center text-sm text-ink-soft">Building your card…</div>
        )}
      </div>

      {hasPosition && (
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[#5ba622]"
            checked={includeAmount}
            onChange={(e) => {
              setCaptionEdited(false);
              setIncludeAmount(e.target.checked);
            }}
          />
          Include my planted amount in the caption
        </label>
      )}

      <div>
        <label htmlFor="harvest-caption" className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Caption
        </label>
        <textarea
          id="harvest-caption"
          value={caption}
          onChange={(e) => {
            setCaptionEdited(true);
            setCaption(e.target.value);
          }}
          rows={6}
          className="mt-1 w-full resize-y rounded-xl2 border border-grass-light/40 bg-white/90 p-3 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-grass-dark"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={handleShare} disabled={busy} className="w-full sm:w-auto">
          {busy ? "Preparing…" : "Share Harvest"}
        </Button>
        <Button variant="ghost" onClick={handleSave} className="w-full sm:w-auto">
          Save image
        </Button>
        <Button variant="ghost" onClick={handleCopy} className="w-full sm:w-auto">
          Copy caption
        </Button>
      </div>
      {note && (
        <p className="text-sm text-ink-soft" role="status">
          {note}
        </p>
      )}
    </Card>
  );
}
