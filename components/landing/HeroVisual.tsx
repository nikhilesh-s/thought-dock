// Hero stage: DeskOS window with the phone in front. Fixed aspect ratio + container units keep
// the travelling thought aligned with both mocks at every width. Decorative: the page gives
// the text alternative in a <figcaption>.
import { DeskMock } from "./DeskMock";
import { HERO_THOUGHT, PhoneMock } from "./PhoneMock";
import s from "./landing.module.css";

export function HeroVisual() {
  return (
    // Below md the stage is wider than the screen and cropped on the right (the section clips
    // overflow), so the phone and inbox stay legible instead of shrinking to a thumbnail.
    <div aria-hidden className="@container relative aspect-[1200/700] w-[170%] sm:w-[130%] md:mx-auto md:w-full md:max-w-[1100px]">
      <div className="absolute right-0 top-0 w-[84%]">
        <DeskMock arriving />
      </div>
      <div className="absolute bottom-0 left-[2%] w-[22%]">
        <PhoneMock />
      </div>
      {/* Box metrics mirror the inbox row (desk em = 1.25cqw × 0.84) so it lands exactly on it. */}
      <div className={`${s.ghost} rounded-[0.59cqw] bg-surface px-[0.84cqw] py-[0.59cqw] text-[1.05cqw] leading-[1.35] text-text shadow-2 ring-1 ring-line`}>
        {HERO_THOUGHT}
      </div>
    </div>
  );
}
