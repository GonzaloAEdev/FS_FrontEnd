import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mascotas: [],
    areMascotasLoading: false
};

export const mascotasSlice = createSlice({
    name: "mascotas",
    initialState: initialState,
    reducers: {
        setMascotas: (state, action) => {
            state.mascotas = action.payload;
        },
        addMascota: (state, action) => {
            const newMascota = action.payload;
            state.mascotas.push(newMascota);
        },
        deleteMascota: (state, action) => {
            const id = action.payload;
            state.mascotas = state.mascotas.filter(mascota => mascota._id !== id);
        },
        updateMascota: (state, action) => {
            const id = action.payload.id;
            const updatedMascota = action.payload.updatedMascota;
            state.mascotas = state.mascotas.map(mascota =>
                mascota._id === id ? { ...mascota, ...updatedMascota } : mascota
            );
        },
        setAreMascotasLoading: (state, action) => {
            state.areMascotasLoading = action.payload;
        }
    },
});

export const { setMascotas, addMascota, deleteMascota, updateMascota, setAreMascotasLoading } = mascotasSlice.actions;

export default mascotasSlice.reducer;
