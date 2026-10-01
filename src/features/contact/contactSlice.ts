// src/features/contacts/contactSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getContacts, deleteContact as apiDeleteContact } from "../../services/contact/contact.api";
import { Contact } from "../../services/contact/contact.type";
import type { RootState } from "../../store"; // RootState را ایمپورت کنید

interface ContactState {
  contacts: Contact[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ContactState = {
  contacts: [],
  status: "idle",
  error: null,
};

export const fetchContacts = createAsyncThunk<
  Contact[],
  { force?: boolean } | void,
  { state: RootState }
>(
  "contacts/fetchContacts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getContacts();
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || "fail to fetch contacts");
    }
  },
  {
    condition: (args, { getState }) => {
      const { contact } = getState();
      if (contact.status === "loading") {
        return false;
      }
      if (contact.status === "succeeded" && !args?.force) {
        return false;
      }
      return true;
    },
  }
);

export const removeContact = createAsyncThunk(
  "contacts/removeContact",
  async (id: string, { rejectWithValue }) => {
    try {
      await apiDeleteContact(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || "fail to remove contact");
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action: PayloadAction<Contact[]>) => {
        state.status = "succeeded";
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(removeContact.fulfilled, (state, action: PayloadAction<string>) => {
        state.contacts = state.contacts.filter((item) => item._id !== action.payload);
      });
  },
});

export default contactSlice.reducer;
