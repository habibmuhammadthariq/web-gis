import dynamic from "next/dynamic";

const VectorTileMap = dynamic(() => import("@/components/VectorTiles"), {
  ssr: false
});

export default function VectorTilePage() {
  return <VectorTileMap />;
} 