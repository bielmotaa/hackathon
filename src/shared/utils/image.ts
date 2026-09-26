// O Wikimedia (origem das fotos) responde 403 ao User-Agent padrão do Android (okhttp) e o React Native
// não permite trocá-lo em <Image>. O images.weserv.nl busca a foto por nós e já a entrega redimensionada.
const IMAGE_PROXY = "https://images.weserv.nl/"
const IMAGE_WIDTH = 800

export function getImageUrl(url: string) {
  return `${IMAGE_PROXY}?url=${encodeURIComponent(url)}&w=${IMAGE_WIDTH}&output=jpg`
}
