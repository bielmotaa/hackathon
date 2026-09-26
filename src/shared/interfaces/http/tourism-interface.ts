export interface CategoryHttpResponse {
    slug: string
    nome: string
    total: number
}

// Imagem do lugar: URL do Wikimedia Commons (a API não hospeda arquivos).
// `url` é a miniatura (~960px) e `original` é o arquivo completo (pesado, não usar em listas).
export interface PlaceImageHttpResponse {
    url?: string | null
    original?: string | null
    fonte?: string | null
    arquivo?: string | null
    autor?: string | null
    licenca?: string | null
    atribuicao?: string | null
    commons_url?: string | null
    distancia_m?: number | null
}

// Contrato do Ponto conforme o /openapi.json da API (http://191.252.179.102/docs).
export interface PlaceHttpResponse {
    id: string
    nome: string
    categoria: string
    subcategoria?: string | null
    descricao_curta?: string | null
    localizacao?: {
        endereco?: string | null
        bairro?: string | null
        municipio?: string | null
        estado?: string | null
        pais?: string | null
    }
    coordenadas?: { latitude: number, longitude: number } | null
    horario_funcionamento?: string | null
    preco_ingresso?: string | null
    contato?: { site?: string | null, telefone?: string | null }
    dicas_observacoes?: string | null
    status_verificacao: string
    categoria_slug?: string | null
    imagem?: PlaceImageHttpResponse | null
}

export interface PlacesPageHttpResponse {
    total: number
    limit: number
    offset: number
    items: PlaceHttpResponse[]
}

export interface NearbyPlacesHttpResponse {
    latitude: number
    longitude: number
    raio_km: number
    total: number
    items: { distancia_km: number, ponto: PlaceHttpResponse }[]
}
