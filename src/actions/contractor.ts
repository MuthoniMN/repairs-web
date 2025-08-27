"use server";

import { apiClient } from "./apiClient";
import { IContractor } from "../types/index";

export const getAllContractors = async (accessToken?: string) => {
    try {
        const data = await apiClient('/contractors', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getContractorById = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/contractors/${id}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const createContractor = async (contractorData: IContractor, accessToken?: string) => {
    try {
        const data = await apiClient('/contractors', {
            method: 'POST',
            body: JSON.stringify(contractorData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateContractor = async (id: string, contractorData: IContractor, accessToken?: string) => {
    try {
        const data = await apiClient(`/contractors/${id}`, {
            method: 'PUT',
            body: JSON.stringify(contractorData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deleteContractor = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/contractors/${id}`, {
            method: 'DELETE',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
