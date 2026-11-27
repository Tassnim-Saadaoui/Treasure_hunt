/**
 * transparentSprite.ts
 *
 * Supprime le fond blanc extérieur d'une illustration à contour noir
 * par flood-fill depuis les bords du canvas (préserve les zones blanches
 * internes comme l'œil ou les plumes claires).
 *
 * Résultat mis en cache (Map) : chaque src n'est traité qu'une seule fois.
 */

const processedSpriteCache = new Map<string, Promise<string>>();

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Retourne une data-URL PNG avec le fond blanc extérieur rendu transparent.
 * @param src          URL ou data-URL de l'image source (JPG ou PNG)
 * @param maxDimension Dimension maximale avant traitement (défaut : 640 px)
 */
export function removeWhiteBackgroundFromEdges(
  src: string,
  maxDimension = 640
): Promise<string> {
  const cached = processedSpriteCache.get(src);
  if (cached) return cached;

  const promise = (async () => {
    try {
      const img = await loadImage(src);
      const scale = Math.min(1, maxDimension / Math.max(img.naturalWidth, img.naturalHeight));
      const width  = Math.max(1, Math.round(img.naturalWidth  * scale));
      const height = Math.max(1, Math.round(img.naturalHeight * scale));

      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return src;

      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      const totalPixels = width * height;
      const visited = new Uint8Array(totalPixels);
      const queue   = new Int32Array(totalPixels);
      let head = 0;
      let tail = 0;

      const isBackgroundWhite = (idx: number, threshold: number, maxChroma: number) => {
        const o = idx * 4;
        const r = data[o], g = data[o + 1], b = data[o + 2];
        return (
          r >= threshold &&
          g >= threshold &&
          b >= threshold &&
          Math.max(r, g, b) - Math.min(r, g, b) <= maxChroma
        );
      };

      const enqueueIfWhite = (x: number, y: number) => {
        const idx = y * width + x;
        if (visited[idx]) return;
        if (isBackgroundWhite(idx, 224, 32)) {
          visited[idx] = 1;
          queue[tail++] = idx;
        }
      };

      // Seed from all four edges
      for (let x = 0; x < width;  x++) { enqueueIfWhite(x, 0); enqueueIfWhite(x, height - 1); }
      for (let y = 1; y < height - 1; y++) { enqueueIfWhite(0, y); enqueueIfWhite(width - 1, y); }

      // BFS flood-fill
      while (head < tail) {
        const idx = queue[head++];
        data[idx * 4 + 3] = 0; // make transparent

        const x = idx % width;
        const y = (idx - x) / width;

        const neighbors = [
          x > 0           ? idx - 1     : -1,
          x < width  - 1  ? idx + 1     : -1,
          y > 0           ? idx - width : -1,
          y < height - 1  ? idx + width : -1,
        ];
        for (const n of neighbors) {
          if (n !== -1 && !visited[n] && isBackgroundWhite(n, 210, 38)) {
            visited[n] = 1;
            queue[tail++] = n;
          }
        }
      }

      // Soften anti-aliased edge pixels adjacent to the transparent region
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = y * width + x;
          if (visited[idx]) continue;

          const touchesTransparent =
            visited[idx - 1] || visited[idx + 1] ||
            visited[idx - width] || visited[idx + width];
          if (!touchesTransparent) continue;

          const o   = idx * 4;
          const r   = data[o], g = data[o + 1], b = data[o + 2];
          const lum = (r + g + b) / 3;

          if (lum > 180 && Math.max(r, g, b) - Math.min(r, g, b) < 40) {
            const newAlpha = Math.max(0, Math.min(255, Math.round(((242 - lum) / 62) * 255)));
            data[o + 3] = Math.min(data[o + 3], newAlpha);
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      return canvas.toDataURL('image/png');
    } catch {
      return src;
    }
  })();

  processedSpriteCache.set(src, promise);
  return promise;
}
