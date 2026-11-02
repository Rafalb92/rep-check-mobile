export interface NormalizedPoint {
  x: number;
  y: number;
}

/**
 * Maps a landmark from model space to portrait screen space for the BACK camera.
 * The back sensor is mounted rotated -90° relative to the portrait display
 * (no mirroring), so axes swap and exactly one of them is inverted.
 * Verified empirically on device (nose position at screen top/bottom/left/right).
 */
export function toPortraitBack(p: NormalizedPoint): NormalizedPoint {
  return {
    x: 1 - p.y,
    y: p.x,
  };
}
