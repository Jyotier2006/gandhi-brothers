import sharp from 'sharp';

async function trimLogo() {
  try {
    const inputPath = 'public/page2.png';
    const outputPath = 'public/logo.png';
    
    console.log(`Aggressively trimming ${inputPath}...`);
    
    const image = sharp(inputPath);
    
    // Trim with a higher threshold to ignore compression artifacts
    // and extract the channel to find the actual content bounds
    await image
      .trim({ 
        threshold: 20,
        background: { r: 255, g: 255, b: 255, alpha: 0 } // Handle transparent or white backgrounds
      })
      .toFile(outputPath);
    
    const metadata = await sharp(outputPath).metadata();
    console.log("FINAL Logo Dimensions:", metadata.width, "x", metadata.height);
    console.log("SUCCESS");
  } catch (err) {
    console.error("FAILED", err);
  }
}

trimLogo();
