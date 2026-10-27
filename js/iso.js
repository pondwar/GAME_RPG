// js/iso.js - Isometric 2:1 Projection & Coordinate Transformations for Aethelgard
// 26.565° isometric angle (2:1 slope)
// cos = 2/sqrt(5) ≈ 0.894427, sin = 1/sqrt(5) ≈ 0.447214

(function(global) {
  'use strict';

  const COS = 0.894427191;
  const SIN = 0.447213595;

  const Iso = {
    COS,
    SIN,

    // Convert continuous ground floor coordinates (wx, wy) and elevation (wz) to screen space
    worldToScreen(wx, wy, wz = 0) {
      return {
        sx: (wx - wy) * COS,
        sy: (wx + wy) * SIN - wz
      };
    },

    // Convert screen space coordinates back to continuous ground floor (wx, wy)
    screenToWorld(sx, sy) {
      return {
        wx: (sx / COS + sy / SIN) / 2,
        wy: (sy / SIN - sx / COS) / 2
      };
    },

    // Calculate isometric ground length for a given sprite width on screen
    groundLength(screenWidth) {
      return screenWidth / COS;
    },

    // Depth sorting key: primary depth on isometric ground is wx + wy
    depthKey(wx, wy) {
      return wx + wy;
    },

    // Distance on ground plane
    dist(wx1, wy1, wx2, wy2) {
      const dx = wx1 - wx2;
      const dy = wy1 - wy2;
      return Math.sqrt(dx * dx + dy * dy);
    }
  };

  global.Iso = Iso;
})(typeof window !== 'undefined' ? window : global);
