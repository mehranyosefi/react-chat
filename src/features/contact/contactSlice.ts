// src/features/contacts/contactSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getContacts,
  createContact,
  deleteContact,
  updateContact,
} from "../../services/contact/contact.api";
import type { RootState } from "../../store";
import { ContactInput, ContactState } from "./index.type";
import { Contact } from "../../services/contact/contact.type";

const initialState: ContactState = {
  contacts: [],
  status: "idle",
  error: null,

  createStatus: "idle",
  createError: null,
  updateStatus: "idle",
  updateError: null,
};
function getErrorMessage(error: unknown): string {
  const apiError = error as {
    message?: string;
    response?: { data?: { message?: string } };
  };

  return apiError.response?.data?.message ?? apiError.message ?? "Accure error";
}

export const getContactsThunk = createAsyncThunk<
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
      return rejectWithValue(getErrorMessage(err));
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
  },
);
export const createContactThunk = createAsyncThunk<
  Contact,
  ContactInput,
  { rejectValue: string }
>("contact/createContact", async (data, { rejectWithValue }) => {
  try {
    const res = await createContact(data);
    return res.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const deleteContactThunk = createAsyncThunk(
  "contacts/removeContact",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteContact(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
export const updateContactThunk = createAsyncThunk<
  Contact,
  { id: string; data: ContactInput },
  { rejectValue: string }
>("contact/updateContact", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await updateContact(id, data);
    return res.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Fetch
      .addCase(getContactsThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        getContactsThunk.fulfilled,
        (state, action: PayloadAction<Contact[]>) => {
          state.status = "succeeded";
          state.contacts = action.payload;
        },
      )
      .addCase(getContactsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Create
      .addCase(createContactThunk.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createContactThunk.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.contacts.push(action.payload);
      })
      .addCase(createContactThunk.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
          action.payload ?? action.error.message ?? "error on create contact";
      })
      //Edit
      .addCase(updateContactThunk.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateContactThunk.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";

        const index = state.contacts.findIndex(
          (item) => item._id === action.payload._id
        );

        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
      })
      .addCase(updateContactThunk.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          action.payload ?? action.error.message ?? "Error on edit contact";
      })

      //Delete
      .addCase(
        deleteContactThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.contacts = state.contacts.filter(
            (item) => item._id !== action.payload,
          );
        },
      );
  },
});

export default contactSlice.reducer;
