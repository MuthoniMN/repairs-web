"use server";

import { apiClient } from "./apiClient";
import { IRole } from "../types/index";

export const getAllRoles = async (accessToken?: string) => {
    try {
        const data = await apiClient('/roles', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getAllPermissions = async (accessToken?: string) => {
    try {
        const data = await apiClient('/permissions', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getRoleById = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/roles/${id}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const createRole = async (roleData: IRole, accessToken?: string) => {
    try {
        const data = await apiClient('/roles', {
            method: 'POST',
            body: JSON.stringify(roleData),
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateRole = async (id: string, roleData: IRole, accessToken?: string) => {
    try {
        const data = await apiClient(`/roles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(roleData),
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deleteRole = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/roles/${id}`, {
            method: 'DELETE',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
