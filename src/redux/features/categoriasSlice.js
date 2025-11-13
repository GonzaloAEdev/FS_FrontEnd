import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    categorias: [],
    areCategoriasLoading: false
};

export const categoriasSlice = createSlice({
    name: "categorias",
    initialState: initialState,
    reducers: {
        setCategorias: (state, action) => {
            state.categorias = action.payload;
        },
        addCategoria: (state, action) => {
            const newCategoria = action.payload;
            state.categorias.push(newCategoria);
        },
        deleteCategoria: (state, action) => {
            const id = action.payload;
            state.categorias = state.categorias.filter(categoria => categoria._id !== id);
        },
        updateCategoria: (state, action) => {
            const id = action.payload.id;
            const updatedCategoria = action.payload.updatedCategoria;
            state.categorias = state.categorias.map(categoria => 
                categoria._id === id ? { ...categoria, ...updatedCategoria } : categoria
            );
        },
        setAreCategoriasLoading: (state, action) => {
            state.areCategoriasLoading = action.payload;
        }
    },
});
export const { setCategorias, addCategorias, deleteCategoria, updateCategoria, setAreCategoriasLoading } = categoriasSlice.actions;

export default categoriasSlice.reducer;