
# Embed Logo as 3D Plane in WebGL Scene

## Overview
Move the APEX logo from a DOM overlay into the WebGL 3D scene as a textured plane. This allows particles to pass in front of and behind it, creating true depth and occlusion.

## What This Achieves
- The logo becomes part of the 3D world with proper z-depth
- Particles will naturally occlude (pass in front of) parts of the logo when close to the camera
- The logo will be affected by post-processing effects (bloom, chromatic aberration)
- Creates a cohesive, immersive experience where nothing feels "pasted on top"

## Implementation Steps

### 1. Create 3D Logo Component in SovereignVoid
Add a new component called `LogoPlane` inside `SovereignVoid.tsx`:
- Use `useTexture` from drei to load the apex-logo.png
- Render as a `planeGeometry` with `meshBasicMaterial` 
- Enable transparency and set `depthWrite={false}` for proper alpha blending
- Position at z=0 (center of scene) so particles can pass in front and behind
- Add subtle breathing animation (scale pulse) synced with the orb

### 2. Add Multi-Layer Glow Effect
Create ethereal glow layers around the logo within 3D space:
- Inner glow: Slightly larger blurred plane behind the main logo
- Outer glow: Larger, more transparent plane for ambient light bleed
- Use additive blending for the glow layers to integrate with particle lighting

### 3. Remove DOM Logo from Index.tsx
Strip out the current HTML/CSS logo overlay:
- Remove the entire "MASSIVE SOVEREIGN LOGO" div block
- Keep vignette overlays and other UI elements
- The 3D logo will now handle all logo presentation

### 4. Configure Depth and Occlusion
Set proper render order and depth settings:
- Logo plane: `depthWrite={false}` to allow transparent blending
- Particles: Already use additive blending, will naturally interact
- Orb and rings: Will occlude based on their z-position relative to logo

---

## Technical Details

**Logo positioning in 3D space:**
```text
Camera (z=20) ──► Particles (z=5-25) ──► Logo (z=2) ──► Orb (z=0) ──► Background particles (z=-20 to -55)
```

**Key drei hooks used:**
- `useTexture`: Preloads texture and uploads to GPU
- `Billboard` (optional): Always faces camera regardless of rotation

**Material configuration for transparent PNG:**
```
transparent={true}
map={texture}
depthWrite={false}
blending={THREE.NormalBlending}
```

**Files to modify:**
- `src/components/3d/SovereignVoid.tsx` - Add LogoPlane component
- `src/pages/Index.tsx` - Remove DOM logo overlay
