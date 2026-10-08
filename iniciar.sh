#!/bin/bash
# Abre el portal en http://localhost:8000 (así cargan YouTube y el mapa)
cd "$(dirname "$0")"
(sleep 1; xdg-open http://localhost:8000 >/dev/null 2>&1) &
python3 -m http.server 8000
