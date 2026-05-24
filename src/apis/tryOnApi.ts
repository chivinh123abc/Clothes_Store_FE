/**
 * Virtual Try-On API using HuggingFace IDM-VTON Gradio Space
 * Space: https://huggingface.co/spaces/yisol/IDM-VTON
 *
 * Uses @gradio/client — the official HuggingFace Gradio client library.
 * It handles file upload, queue management, SSE polling, and result parsing
 * correctly for any Gradio version. No API key required.
 */
import { Client, handle_file } from '@gradio/client'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Convert a base64 data URI to a Blob */
function base64ToBlob(dataUri: string): Blob {
  const [header, raw] = dataUri.split(',')
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg'
  const bytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0))
  return new Blob([bytes], { type: mime })
}

/** Fetch a URL and return it as a Blob (works for same-origin & CORS-open URLs) */
async function urlToBlob(url: string): Promise<Blob> {
  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`Failed to fetch image: ${url}`)
  return resp.blob()
}

/** Ensure we have a Blob regardless of whether input is base64 or URL */
async function toBlob(source: string): Promise<Blob> {
  if (source.startsWith('data:')) return base64ToBlob(source)
  return urlToBlob(source)
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Run virtual try-on using IDM-VTON on HuggingFace.
 *
 * @param modelImage        base64 data URI or URL of the person photo
 * @param garmentImage      base64 data URI or URL of the garment image
 * @param garmentDescription short text label for the garment
 * @param categoryName      optional category name of the garment
 * @returns Promise<string>  URL of the result image
 */
export async function runTryOn(
  modelImage: string,
  garmentImage: string,
  garmentDescription: string = 'clothing',
  categoryName?: string
): Promise<string> {
  // ── Convert inputs to Blobs ───────────────────────────────────────────────
  // eslint-disable-next-line no-console
  console.log('[TryOn] preparing images…')
  const [modelBlob, garmentBlob] = await Promise.all([
    toBlob(modelImage),
    toBlob(garmentImage)
  ])
  // eslint-disable-next-line no-console
  console.log('[TryOn] model:', (modelBlob.size / 1024).toFixed(1), 'KB |',
    'garment:', (garmentBlob.size / 1024).toFixed(1), 'KB')

  // ── Construct optimal prompt for IDM-VTON category classification ──────────
  const descLower = garmentDescription.toLowerCase()
  const catLower = (categoryName || '').toLowerCase()

  let finalDescription = garmentDescription
  
  const isBottom = ['pants', 'shorts', 'jeans', 'skirt', 'quần', 'bottoms', 'lower'].some(
    kw => descLower.includes(kw) || catLower.includes(kw)
  )
  const isDress = ['dress', 'one-piece', 'suit', 'váy', 'đầm', 'dresses'].some(
    kw => descLower.includes(kw) || catLower.includes(kw)
  )
  
  if (isBottom) {
    finalDescription = `pants, lower_body, bottoms, ${garmentDescription}`
  } else if (isDress) {
    finalDescription = `dresses, dress, one-piece, ${garmentDescription}`
  } else {
    finalDescription = `tops, upper_body, shirt, tshirt, hoodie, jacket, ${garmentDescription}`
  }

  // eslint-disable-next-line no-console
  console.log('[TryOn] prompt for IDM-VTON:', finalDescription)

  // ── Connect to the IDM-VTON Gradio Space ─────────────────────────────────
  // HuggingFace public spaces allow all-origin CORS, so no proxy needed.
  // eslint-disable-next-line no-console
  console.log('[TryOn] connecting to yisol/IDM-VTON…')
  const hfToken = import.meta.env.VITE_HF_TOKEN || localStorage.getItem('hf_token') || undefined
  const client = await Client.connect('yisol/IDM-VTON', hfToken ? { token: hfToken } : undefined)

  // ── Predict (call /tryon endpoint) ───────────────────────────────────────
  // IDM-VTON function signature:
  //   tryon(dict, garm_img, garment_des, is_checked, is_checked_crop, denoise_steps, seed)
  // eslint-disable-next-line no-console
  console.log('[TryOn] calling /tryon…')
  const result = await client.predict('/tryon', {
    dict: {
      background: handle_file(modelBlob),  // ImageEditor background = human photo
      layers: [],
      composite: null
    },
    garm_img:        handle_file(garmentBlob),
    garment_des:     finalDescription,
    is_checked:      true,   // auto-masking
    is_checked_crop: false,
    denoise_steps:   30,
    seed:            42
  })

  // eslint-disable-next-line no-console
  console.log('[TryOn] raw result:', result)

  // ── Extract result image URL ──────────────────────────────────────────────
  const data = (result as any)?.data
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('IDM-VTON returned no output data')
  }

  // Result is typically: [output_image_FileData, masked_image_FileData]
  for (const slot of data) {
    if (!slot) continue

    // Gradio FileData object
    if (typeof slot === 'object') {
      if (typeof slot.url === 'string' && slot.url) return slot.url
      if (typeof slot.path === 'string' && slot.path) return slot.path
    }

    // Plain string URL or base64
    if (typeof slot === 'string' && (slot.startsWith('http') || slot.startsWith('data:'))) {
      return slot
    }
  }

  throw new Error(
    `IDM-VTON returned ${data.length} slot(s) but no image URL was found. ` +
    `Check the browser console for details.`
  )
}
