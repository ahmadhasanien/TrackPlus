import wave from "@/assets/landingpage/landwave.svg";
import "./wave-loop.css";

/**
 * Seamless, single-iteration, wrap-around translation of landwave.svg.
 *
 * How the wrap-around works:
 * - Both `.wave-loop-viewport` (outer) and `.wave-loop-track` (inner) are
 *   `overflow: hidden` / `position: relative` / `width: 100%`, so neither
 *   copy can ever paint outside the component's box, regardless of
 *   ancestor layout.
 * - `.wave-loop-track` is also pinned to `direction: ltr`. This component
 *   is used inside `dir="rtl"` ancestors (e.g. DemoRequestPage); without
 *   forcing LTR here, the two copies would visually reorder and the fixed
 *   translate values below would no longer land where the math expects,
 *   which is what caused the old leak-off-screen-to-the-left bug.
 * - Copy 1 starts at `translateX(0%)` (in place) and animates to
 *   `translateX(-100%)` (fully exited off the left edge).
 * - Copy 2 starts pre-positioned at `translateX(100%)` (fully off-screen
 *   to the right) and animates to `translateX(0%)` simultaneously, so it
 *   slides in and lands exactly where copy 1 started.
 * - Both copies share the same 14s linear duration, so the moment the
 *   cycle finishes, copy #2 sits pixel-for-pixel where copy #1 began —
 *   the wrap reads as seamless and the scene is back at its initial
 *   visual state.
 * - `animation-iteration-count: 1` + `animation-fill-mode: forwards` on
 *   each copy means they play once on mount and then freeze in that
 *   (visually identical) resting position — no infinite loop.
 *
 * Used identically on the Hero section and the Request Demo page so both
 * share the exact same motion.
 */
export function WaveLoop() {
  return (
    <div
      className="wave-loop-viewport pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden opacity-40"
      aria-hidden
    >
      <div className="wave-loop-track">
        <img src={wave} alt="" className="wave-loop-img wave-loop-img--copy1" />
        <img src={wave} alt="" className="wave-loop-img wave-loop-img--copy2" />
      </div>
    </div>
  );
}
