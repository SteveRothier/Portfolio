/**
 * Recompresse les PNG/JPEG dans src/assets (écrasement si plus léger).
 * Génère aussi src/assets/background.webp pour le fond d’écran.
 */
import { readdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const assetsRoot = path.join(__dirname, '..', 'src', 'assets')

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const ent of entries) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) yield* walk(full)
    else yield full
  }
}

async function main() {
  for await (const file of walk(assetsRoot)) {
    const ext = path.extname(file).toLowerCase()
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue

    const buf = await readFile(file)

    if (ext === '.jpg' || ext === '.jpeg') {
      const meta = await sharp(buf).metadata()

      if (file.endsWith('background.jpg')) {
        const webpPath = file.replace(/\.jpe?g$/i, '.webp')
        await sharp(buf).webp({ quality: 82, effort: 6 }).toFile(webpPath)
        const webpBuf = await readFile(webpPath)
        console.log(`WebP wallpaper ${path.relative(assetsRoot, webpPath)} (${webpBuf.length} bytes)`)
        console.log(`WELCOME_BG_DIMENSIONS width=${meta.width} height=${meta.height}`)
      }

      const out = await sharp(buf).jpeg({ quality: 82, mozjpeg: true }).toBuffer()
      if (out.length <= buf.length) {
        await writeFile(file, out)
        console.log(`JPEG ${path.relative(assetsRoot, file)} ${buf.length} → ${out.length}`)
      }
      continue
    }

    if (ext === '.png') {
      const out = await sharp(buf).png({ compressionLevel: 9, effort: 10 }).toBuffer()
      if (out.length <= buf.length) {
        await writeFile(file, out)
        console.log(`PNG ${path.relative(assetsRoot, file)} ${buf.length} → ${out.length}`)
      } else {
        console.log(`PNG skip (larger): ${path.relative(assetsRoot, file)}`)
      }
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
