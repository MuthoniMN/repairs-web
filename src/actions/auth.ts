"use server";

import { apiClient } from "./apiClient";

export const login = async (credentials: { email: string; password: string }) => {
    try {
        const data = await apiClient('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const createPassword = async (data: { email: string; password: string; token: string }) => {
    try {
        const result = await apiClient('/auth/create-password', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const resetPassword = async (data: { email: string; password: string }) => {
    try {
        const result = await apiClient('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const sendOtp = async (email: string) => {
    try {
        const result = await apiClient('/auth/send-otp', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const verifyOtp = async (data: { email: string; code: string }) => {
    try {
        const result = await apiClient('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const refreshToken = async (refreshToken: string) => {
    try {
        const result = await apiClient('/auth/refresh-token', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
        });
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
