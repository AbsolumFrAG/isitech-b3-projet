import { createSlice } from "@reduxjs/toolkit";
import { useAppSelector } from "../redux/hooks";

export interface AddServerState {
    addServerOpen: boolean;
    addServerWindow:
    | "Créer un serveur"
    | "Rejoindre un serveur"
    | "A propos du serveur"
    | "Personnaliser le serveur";
}

const initialState: AddServerState = {
    addServerOpen: false,
    addServerWindow: "Créer un serveur",
};

export const addServerSlice = createSlice({
    name: "addServer",
    initialState,
    reducers: {
        setAddServerOpen(state, action) {
            state.addServerOpen = action.payload;
        },

        setAddServerWindow(state, action) {
            state.addServerWindow = action.payload;
        },
    },
});

export const { setAddServerOpen, setAddServerWindow } = addServerSlice.actions;

export const useAddServerState = () =>
    useAppSelector((state) => state.addServer);

export default addServerSlice.reducer;