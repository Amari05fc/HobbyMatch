import json
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Marvio - Recomendador de Hobbies")

# Habilitar CORS para que tu frontend en React pueda conectar
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # Cambia esto a tu dominio en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PerfilUsuario(BaseModel):
    energia: float
    sociabilidad: float
    creatividad: float
    paciencia: float
    tiempoLibre: float
    estresActual: float
    curiosidad: float
    actividadFisica: float
    necesidadSocial: float
    necesidadRelajacion: float
    competitividad: float
    organizacion: float
    expresionArtistica: float
    preferenciaExterior: float
    toleranciaFrustracion: float
    presupuesto: float
    independencia: float
    constancia: float
    nivelTecnologico: float
    busquedaAventura: float


BASE_DIR = Path(__file__).resolve().parent.parent
SHARED_HOBBIES_PATH = BASE_DIR / "shared" / "hobbies.json"

with SHARED_HOBBIES_PATH.open("r", encoding="utf-8") as hobbies_file:
    hobbies_data = json.load(hobbies_file)

HOBBIES = hobbies_data["HOBBIES"]

UMBRAL_MINIMO = 0.4   # Escala 0-1: rechazamos si la mejor puntuación es menor a 0.5

# ====================== ENDPOINT PRINCIPAL ======================
@app.post("/recomendar-hobbies")
async def recomendar_hobbies(perfil: PerfilUsuario):
    valores_usuario = [
        perfil.energia, perfil.sociabilidad, perfil.creatividad, perfil.paciencia,
        perfil.tiempoLibre, perfil.estresActual, perfil.curiosidad, perfil.actividadFisica,
        perfil.necesidadSocial, perfil.necesidadRelajacion, perfil.competitividad,
        perfil.organizacion, perfil.expresionArtistica, perfil.preferenciaExterior,
        perfil.toleranciaFrustracion, perfil.presupuesto, perfil.independencia,
        perfil.constancia, perfil.nivelTecnologico, perfil.busquedaAventura
    ]

    resultados = []

    for hobby in HOBBIES:
        # Lógica de similitud: medir qué tan cercano es el perfil del usuario al hobby
        # Para cada dimensión: score = 1 - |usuario_valor - hobby_peso|
        # Luego promediamos los 20 valores para obtener compatibilidad total
        compatibilidades = []
        for i in range(20):
            similarity = 1 - abs(valores_usuario[i] - hobby["weights"][i])
            compatibilidades.append(similarity)

        puntaje_total = sum(compatibilidades) / 20  # Normalizar a escala 0-1

        resultados.append({
            "name": hobby["name"],
            "short": hobby["short"],
            "emoji": hobby["emoji"],
            "desc": hobby["desc"],
            "score": round(puntaje_total, 3),
            "porcentaje": round(puntaje_total * 100, 1)
        })

    # Ordenar de mayor a menor puntaje
    resultados.sort(key=lambda x: x["score"], reverse=True)

    # Si la mejor recomendación es muy baja, devolvemos un resultado falso
    if resultados[0]["score"] < UMBRAL_MINIMO:
        return {
            "success": False,
            "message": "No hay coincidencias confiables con tu perfil actual.",
            "sugerencia": "Intenta ajustar algunas variables para recibir mejores recomendaciones."
        }

    return {
        "success": True,
        "top3": resultados[:3]
    }


# Endpoint de prueba
@app.get("/")
async def root():
    return {"message": "Backend funcionando correctamente"}