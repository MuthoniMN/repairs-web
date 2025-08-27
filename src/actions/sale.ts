"use server";

import { apiClient } from "./apiClient";
import { ISale } from "../types/index";

export const getAllSales = async () => {
    try {
        const data = await apiClient('/sales', {
            method: 'GET',
        });
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getSaleById = async (id: string) => {
    try {
        const data = await apiClient(`/sales/${id}`, {
            method: 'GET',
        });
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const createSale = async (saleData: ISale) => {
    try {
        const data = await apiClient('/sales', {
            method: 'POST',
            body: JSON.stringify(saleData),
        });
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateSale = async (id: string, saleData: ISale) => {
    try {
        const data = await apiClient(`/sales/${id}`, {
            method: 'PUT',
            body: JSON.stringify(saleData),
        });
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deleteSale = async (id: string) => {
    try {
        const data = await apiClient(`/sales/${id}`, {
            method: 'DELETE',
        });
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
