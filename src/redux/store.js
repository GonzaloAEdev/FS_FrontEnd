import { configureStore } from "@reduxjs/toolkit";
import categoriaReducer from './features/categoriasSlice'
import citasReducer from './features/citasSlice'
import mascotasReducer from './features/mascotasSlice'
import usuariosReducer from './features/usuariosSlice'

export const store = configureStore ({
    reducer: {
        categorias: categoriaReducer,
        citas: citasReducer,
        mascotas: mascotasReducer,
        usuarios: usuariosReducer
    }
})