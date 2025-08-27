"use server";

import { apiClient } from "./apiClient";
import { ISupplier } from "../types/index";

export const getAllSuppliers = async (accessToken?: string) => {
    try {
        const data = await apiClient('/suppliers', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getSupplierById = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/suppliers/${id}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const createSupplier = async (supplierData: ISupplier, accessToken?: string) => {
    try {
        const data = await apiClient('/suppliers', {
            method: 'POST',
            body: JSON.stringify(supplierData),
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateSupplier = async (id: string, supplierData: ISupplier, accessToken?: string) => {
    try {
        const data = await apiClient(`/suppliers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(supplierData),
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deleteSupplier = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/suppliers/${id}`, {
            method: 'DELETE',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
