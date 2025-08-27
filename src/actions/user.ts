"use server";

import { apiClient } from "./apiClient";
import { IUser } from "../types/index";

export const getAllUsers = async (accessToken?: string) => {
    try {
        const data = await apiClient('/users', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getUserById = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/users/${id}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const createUser = async (userData: IUser, accessToken?: string) => {
    try {
        const data = await apiClient('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateUser = async (id: string, userData: IUser, accessToken?: string) => {
    try {
        const data = await apiClient(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deleteUser = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/users/${id}`, {
            method: 'DELETE',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getCurrentUser = async (accessToken?: string) => {
    try {
        const data = await apiClient('/users/me', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateProfile = async (userData: Partial<IUser>, accessToken?: string) => {
    try {
        const data = await apiClient('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(userData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
