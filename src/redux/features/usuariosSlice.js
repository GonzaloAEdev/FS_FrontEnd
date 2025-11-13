import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    usuarios: [],
    areUsuariosLoading: false
};

export const usuariosSlice = createSlice({
    name: "usuarios",
    initialState: initialState,
    reducers: {
        setUsuarios: (state, action) => {
            state.usuarios = action.payload;
        },
        addUsuario: (state, action) => {
            const newUsuario = action.payload;
            state.usuarios.push(newUsuario);
        },
        deleteUsuario: (state, action) => {
            const id = action.payload;
            state.usuarios = state.usuarios.filter(usuario => usuario._id !== id);
        },
        updateUsuario: (state, action) => {
            const id = action.payload.id;
            const updatedUsuario = action.payload.updatedUsuario;
            state.usuarios = state.usuarios.map(usuario => 
                usuario._id === id ? { ...usuario, ...updatedUsuario } : usuario
            );
        },
        setAreUsuariosLoading: (state, action) => {
            state.areUsuariosLoading = action.payload;
        }
    },
});

export const { setUsuarios, addUsuario, deleteUsuario, updateUsuario, setAreUsuariosLoading } = usuariosSlice.actions;

export default usuariosSlice.reducer;