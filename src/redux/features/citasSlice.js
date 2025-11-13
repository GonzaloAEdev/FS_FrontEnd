import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    citas: [],
    areCitasLoading: false
};

export const citasSlice = createSlice({
    name: "citas",
    initialState: initialState,
    reducers: {
        setCitas: (state, action) => {
            state.citas = action.payload;
        },
        addCita: (state, action) => {
            const newCita = action.payload;
            state.citas.push(newCita);
        },
        deleteCita: (state, action) => {
            const id = action.payload;
            state.citas = state.citas.filter(cita => cita._id !== id);
        },
        updateCita: (state, action) => {
            const id = action.payload.id;
            const updatedCita = action.payload.updatedCita;
            state.citas = state.citas.map(cita => 
                cita._id === id ? { ...cita, ...updatedCita } : cita
            );
        },
        setAreCitasLoading: (state, action) => {
            state.areCitasLoading = action.payload;
        }
    },
});

export const { setCitas, addCita, deleteCita, updateCita, setAreCitasLoading } = citasSlice.actions;

export default citasSlice.reducer;