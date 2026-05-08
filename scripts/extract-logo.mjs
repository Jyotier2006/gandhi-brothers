import sharp from 'sharp';

async function buildLogo() {
  const input = 'previews copy/thumbnail.png';
  const output = 'public/logo.png';
  
  const meta = await sharp(input).metadata();
  console.log('Source:', meta.width, 'x', meta.height);
  
  // The English logo takes slightly more than 50% of source width.
  // Extract 58% to be safe, then trim the white on all sides.
  const cropWidth = Math.floor(meta.width * 0.58);
  const leftBuf = await sharp(input)
    .extract({ left: 0, top: 0, width: cropWidth, height: meta.height })
    .toBuffer();
  
  // Trim with very low threshold to only remove pure white, not the border
  const trimmedBuf = await sharp(leftBuf)
    .trim({ threshold: 5 })
    .extend({ top: 8, bottom: 8, left: 8, right: 8, background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .toBuffer();

  await sharp(trimmedBuf).toFile(output);
  
  const out = await sharp(output).metadata();
  console.log('Final logo:', out.width, 'x', out.height);
}

buildLogo().catch(console.error);
