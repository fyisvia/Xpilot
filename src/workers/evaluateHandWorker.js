// Web Worker for heavy evaluateHand() computation
import { evaluateHand } from '../utils/evaluation.js'

self.onmessage = (event) => {
  const { id, handTiles, remMap, options } = event.data || {}
  if (!id) return
  try {
    const results = evaluateHand(handTiles, remMap, options)
    self.postMessage({ id, ok: true, results })
  } catch (error) {
    self.postMessage({ id, ok: false, error: error?.message || String(error) })
  }
}
