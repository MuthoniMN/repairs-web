"use server";

import { apiClient } from "./apiClient";
import { IStock } from "../types/index";

export const getAllStocks = async (accessToken?: string) => {
    try {
        const data = await apiClient('/stocks', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getStockById = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/stocks/${id}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const createStock = async (stockData: IStock, accessToken?: string) => {
    try {
        const data = await apiClient('/stocks', {
            method: 'POST',
            body: JSON.stringify(stockData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateStock = async (id: string, stockData: IStock, accessToken?: string) => {
    try {
        const data = await apiClient(`/stocks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(stockData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deleteStock = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/stocks/${id}`, {
            method: 'DELETE',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
