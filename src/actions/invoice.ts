"use server";

import { apiClient } from "./apiClient";
import { IInvoice } from "../types/index";

export const getAllInvoices = async (accessToken: string) => {
    try {
        const data = await apiClient('/invoices', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getInvoiceById = async (id: string, accessToken: string) => {
    try {
        const data = await apiClient(`/invoices/${id}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const createInvoice = async (invoiceData: IInvoice, accessToken: string) => {
    try {
        const data = await apiClient('/invoices', {
            method: 'POST',
            body: JSON.stringify(invoiceData),
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateInvoice = async (id: string, invoiceData: IInvoice, accessToken: string) => {
    try {
        const data = await apiClient(`/invoices/${id}`, {
            method: 'PUT',
            body: JSON.stringify(invoiceData),
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deleteInvoice = async (id: string, accessToken: string) => {
    try {
        const data = await apiClient(`/invoices/${id}`, {
            method: 'DELETE',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
