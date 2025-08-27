"use server";

import { apiClient } from "./apiClient";
import { IProduct } from "../types/index";

export const getAllProducts = async (accessToken?: string) => {
    try {
        const data = await apiClient('/products', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getProductById = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/products/${id}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const createProduct = async (productData: IProduct, accessToken?: string) => {
    try {
        const data = await apiClient('/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateProduct = async (id: string, productData: IProduct, accessToken?: string) => {
    try {
        const data = await apiClient(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData),
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deleteProduct = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/products/${id}`, {
            method: 'DELETE',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getProductsByCategory = async (category: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/products/category/${category}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getLowStockProducts = async (accessToken?: string) => {
    try {
        const data = await apiClient('/products/inventory/low-stock', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getProductSummary = async (accessToken?: string) => {
    try {
        const data = await apiClient('/products/analytics/summary', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
