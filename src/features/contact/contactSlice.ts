import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Contact } from "../../services/contact/contact.type";

interface ContactState {
  contacts: Contact[];
  loading: boolean;
}

const initialState: ContactState = {
  contacts: [],
  loading: true,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    setContacts(state, action: PayloadAction<Contact[]>) {
      state.contacts = action.payload;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setContacts, setLoading } = contactSlice.actions;

export default contactSlice.reducer;