import type { PageLayoutBlock } from "@/lib/types";
import { FeaturedEventsBlock } from "@/blocks/FeaturedEventsBlock";
import { FeaturedSpeakersBlock } from "@/blocks/FeaturedSpeakersBlock";
import { HeroBlock } from "@/blocks/HeroBlock";

interface RenderBlocksProps {
  blocks: PageLayoutBlock[];
}

function renderBlock(block: PageLayoutBlock) {
  switch (block.__typename) {
    case "Hero":
      return <HeroBlock block={block} />;
    case "FeaturedEvent":
      return <FeaturedEventsBlock block={block} />;
    case "FeaturedSpeaker":
      return <FeaturedSpeakersBlock block={block} />;
    default:
      return null;
  }
}

export function RenderBlocks({ blocks }: RenderBlocksProps) {
  return (
    <>
      {blocks.map((block) => (
        <div key={block.id} className="-mt-px">
          {renderBlock(block)}
        </div>
      ))}
    </>
  );
}
