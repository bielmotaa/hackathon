import { useEffect, useMemo, useRef, useState } from "react"
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"
import { WebView, WebViewMessageEvent } from "react-native-webview"

// Mapa MapLibre GL JS + tiles do OpenFreeMap (gratuito, sem chave).
// Renderizado em WebView para funcionar no Expo Go; trocar por MapLibre nativo mexe só neste arquivo.
const MAPLIBRE_VERSION = "5.24.0"
const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/dark"
const LOAD_TIMEOUT_MS = 15000

// Região do catálogo (Manaus): câmera inicial enquanto não há lugares.
const DEFAULT_CENTER = { latitude: -3.119, longitude: -60.0217 }
const DEFAULT_ZOOM = 11

// Espaço reservado aos controles sobre o mapa ao enquadrar os marcadores.
const FIT_PADDING = { top: 150, bottom: 280, left: 48, right: 48 }
const PREVIEW_FIT_PADDING = { top: 32, bottom: 32, left: 32, right: 32 }

export interface MapPlace {
  id: string
  latitude: number
  longitude: number
}

const buildHtml = (interactive: boolean) => `<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<link href="https://cdn.jsdelivr.net/npm/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.js"></script>
<style>
  html, body, #map { margin: 0; height: 100%; background: #0F1613; }
  .pin { width: 36px; height: 36px; box-sizing: border-box; display: flex; align-items: center; justify-content: center;
         background: #E2723A; border: 2px solid #F4EDE0; border-radius: 12px; }
  .pin.selected { background: #F4EDE0; border-color: #E2723A; transform: scale(1.2); }
  .pin.selected svg { stroke: #E2723A; }
  .me { width: 18px; height: 18px; box-sizing: border-box; background: #F4EDE0; border: 4px solid #E2723A; border-radius: 50%;
        box-shadow: 0 0 0 8px rgba(226, 114, 58, 0.25); }
</style>
</head>
<body>
<div id="map"></div>
<script>
  var post = function (message) { window.ReactNativeWebView.postMessage(JSON.stringify(message)); };
  var PIN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4EDE0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
  var markers = [];
  var userMarker = null;
  var placeMarkers = {};

  if (!window.maplibregl) {
    post({ type: "error" });
  } else {
    var map = new maplibregl.Map({
      container: "map",
      style: "${MAP_STYLE_URL}",
      center: [${DEFAULT_CENTER.longitude}, ${DEFAULT_CENTER.latitude}],
      zoom: ${DEFAULT_ZOOM},
      interactive: ${interactive},
      attributionControl: { compact: true }
    });
    map.on("load", function () { post({ type: "ready" }); });
    map.on("error", function () { if (!map.isStyleLoaded()) post({ type: "error" }); });

    window.setUser = function (latitude, longitude) {
      if (!userMarker) {
        var element = document.createElement("div");
        element.className = "me";
        userMarker = new maplibregl.Marker({ element: element }).setLngLat([longitude, latitude]).addTo(map);
      } else {
        userMarker.setLngLat([longitude, latitude]);
      }
    };
    window.centerOnUser = function () {
      if (userMarker) map.easeTo({ center: userMarker.getLngLat(), zoom: 15 });
    };

    map.on("click", function () { post({ type: "select", id: null }); });

    window.setSelected = function (id) {
      Object.keys(placeMarkers).forEach(function (key) {
        placeMarkers[key].getElement().classList.toggle("selected", key === id);
      });
      if (id && placeMarkers[id]) map.easeTo({ center: placeMarkers[id].getLngLat(), offset: [0, -120] });
    };

    window.focusPlace = function (id) {
      if (placeMarkers[id]) map.easeTo({ center: placeMarkers[id].getLngLat(), zoom: 15, offset: [0, -120] });
    };

    window.setPlaces = function (places, padding) {
      markers.forEach(function (marker) { marker.remove(); });
      placeMarkers = {};
      markers = places.map(function (place) {
        var element = document.createElement("div");
        element.className = "pin";
        element.innerHTML = PIN;
        element.addEventListener("click", function (event) {
          event.stopPropagation();
          post({ type: "select", id: place.id });
        });
        var marker = new maplibregl.Marker({ element: element }).setLngLat([place.longitude, place.latitude]).addTo(map);
        placeMarkers[place.id] = marker;
        return marker;
      });
      if (places.length === 1) {
        map.easeTo({ center: [places[0].longitude, places[0].latitude], zoom: 15 });
      } else if (places.length > 1) {
        var bounds = new maplibregl.LngLatBounds();
        places.forEach(function (place) { bounds.extend([place.longitude, place.latitude]); });
        if (userMarker) bounds.extend(userMarker.getLngLat());
        map.fitBounds(bounds, { padding: padding, maxZoom: 15, duration: 600 });
      }
    };
  }
</script>
</body>
</html>`

type MapStatus = "loading" | "ready" | "error"

interface TourismMapProps {
  places: MapPlace[]
  userLocation?: { latitude: number; longitude: number }
  selectedId?: string
  // Lugar para aproximar a câmera (ex.: vindo de "Ver no mapa").
  focusId?: string
  onSelectPlace?: (id?: string) => void
  // false: mapa estático (prévia), sem gestos.
  interactive?: boolean
  // Incrementar para centralizar a câmera no usuário.
  centerOnUserKey?: number
  className?: string
}

export function TourismMap({
  places,
  userLocation,
  selectedId,
  focusId,
  onSelectPlace,
  interactive = true,
  centerOnUserKey = 0,
  className,
}: TourismMapProps) {
  const [status, setStatus] = useState<MapStatus>("loading")
  const [attempt, setAttempt] = useState(0)
  const webViewRef = useRef<WebView>(null)
  const html = useMemo(() => buildHtml(interactive), [interactive])

  useEffect(() => {
    setStatus("loading")
    const timeout = setTimeout(() => setStatus((current) => (current === "ready" ? current : "error")), LOAD_TIMEOUT_MS)
    return () => clearTimeout(timeout)
  }, [attempt])

  // Reenvia os marcadores quando o mapa fica pronto e sempre que a lista muda.
  useEffect(() => {
    if (status === "ready") {
      webViewRef.current?.injectJavaScript(`window.setPlaces(${JSON.stringify(places)}, ${JSON.stringify(interactive ? FIT_PADDING : PREVIEW_FIT_PADDING)}); true;`)
    }
  }, [status, places, interactive])

  useEffect(() => {
    if (status === "ready") {
      webViewRef.current?.injectJavaScript(`window.setSelected(${JSON.stringify(selectedId ?? null)}); true;`)
    }
  }, [status, places, selectedId])

  useEffect(() => {
    if (status === "ready" && focusId) {
      webViewRef.current?.injectJavaScript(`window.focusPlace(${JSON.stringify(focusId)}); true;`)
    }
  }, [status, places, focusId])

  useEffect(() => {
    if (status === "ready" && userLocation) {
      webViewRef.current?.injectJavaScript(
        `window.setUser(${userLocation.latitude}, ${userLocation.longitude}); true;`
      )
    }
  }, [status, userLocation])

  useEffect(() => {
    if (status === "ready" && centerOnUserKey > 0) {
      webViewRef.current?.injectJavaScript("window.centerOnUser(); true;")
    }
  }, [status, centerOnUserKey])

  const handleMessage = (event: WebViewMessageEvent) => {
    const message = JSON.parse(event.nativeEvent.data)
    if (message.type === "ready") setStatus("ready")
    if (message.type === "error") setStatus("error")
    if (message.type === "select") onSelectPlace?.(message.id ?? undefined)
  }

  return (
    <View className={className}>
      <WebView
        key={attempt}
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
        onMessage={handleMessage}
        onError={() => setStatus("error")}
        onHttpError={() => setStatus("error")}
        style={{ flex: 1, backgroundColor: "#0F1613" }}
      />

      {status !== "ready" ? (
        <View className="absolute inset-0 items-center justify-center gap-3 bg-tourism-night px-8">
          {status === "loading" ? (
            <ActivityIndicator color="#E2723A" />
          ) : (
            <>
              <Text className="text-center font-sans text-sm text-tourism-mist">
                Não foi possível carregar o mapa. Verifique sua conexão com a internet.
              </Text>
              <TouchableOpacity onPress={() => setAttempt((current) => current + 1)} activeOpacity={0.8}>
                <Text className="font-sans-semibold text-sm text-tourism-ember">Tentar novamente</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : null}
    </View>
  )
}
