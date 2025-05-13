import { useEffect, useState } from "react";
import { Marker, Tooltip } from "react-leaflet";
import L, { LatLng, LatLngExpression } from "leaflet";

interface MarkerLayerProps {
  initialPosition: LatLngExpression;
  onPositionChange?: (newPosition: LatLng) => void;
}

export default function MarkerLayer({ 
  initialPosition,
  onPositionChange
}: MarkerLayerProps) {
  const [position, setPosition] = useState<LatLng>(L.latLng(initialPosition));
  const [hovered, setHovered] = useState(false);

  // if initial position changes, update marker
  useEffect(() => {
    setPosition(L.latLng(initialPosition));
  }, [initialPosition]);

  const handleDragEnd = (e: L.LeafletEvent) => {
    const marker = e.target as L.Marker;
    const newPos = marker.getLatLng();
    setPosition(newPos);
    if (onPositionChange) onPositionChange(newPos);
  }

  return (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: handleDragEnd,
        mouseover: () => setHovered(true),
        mouseout: () => setHovered(false)
      }}
      >
        { hovered && (
          <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false} >
            {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
          </Tooltip>
        )}
      </Marker>
  )
}