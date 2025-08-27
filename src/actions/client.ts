"use server";

import { apiClient } from "./apiClient";
import { IClient } from "../types/index";

export const getAllClients = async (accessToken?: string) => {
    try {
        const data = await apiClient('/clients', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getClientById = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/clients/${id}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const createClient = async (clientData: IClient, accessToken?: string) => {
    try {
        const data = await apiClient('/clients', {
            method: 'POST',
            body: JSON.stringify(clientData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateClient = async (id: string, clientData: IClient, accessToken?: string) => {
    try {
        const data = await apiClient(`/clients/${id}`, {
            method: 'PUT',
            body: JSON.stringify(clientData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deleteClient = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/clients/${id}`, {
            method: 'DELETE',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
