"use server";

import { apiClient } from "./apiClient";
import { IPayment } from "../types/index";

export const getAllPayments = async (accessToken?: string) => {
    try {
        const data = await apiClient('/payments', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getPaymentById = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/payments/${id}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const createPayment = async (paymentData: IPayment, accessToken?: string) => {
    try {
        const data = await apiClient('/payments', {
            method: 'POST',
            body: JSON.stringify(paymentData),
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updatePayment = async (id: string, paymentData: IPayment, accessToken?: string) => {
    try {
        const data = await apiClient(`/payments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(paymentData),
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deletePayment = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/payments/${id}`, {
            method: 'DELETE',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getRecentPayments = async (limit: number = 10, accessToken?: string) => {
    try {
        const data = await apiClient(`/payments/recent?limit=${limit}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getPaymentSummary = async (accessToken?: string) => {
    try {
        const data = await apiClient('/payments/analytics/summary', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getPaymentStats = async (accessToken?: string) => {
    try {
        const data = await apiClient('/payments/analytics/stats', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
