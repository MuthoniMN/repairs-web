"use server";

import { apiClient } from "./apiClient";
import { IInvite } from "../types/index";

export const getAllInvites = async (accessToken?: string) => {
    try {
        const data = await apiClient('/invites', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getInviteById = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/invites/${id}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const createInvite = async (inviteData: IInvite, accessToken?: string) => {
    try {
        const data = await apiClient('/invites', {
            method: 'POST',
            body: JSON.stringify(inviteData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateInvite = async (id: string, inviteData: IInvite, accessToken?: string) => {
    try {
        const data = await apiClient(`/invites/${id}`, {
            method: 'PUT',
            body: JSON.stringify(inviteData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deleteInvite = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/invites/${id}`, {
            method: 'DELETE',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getInviteByToken = async (token: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/invites/token/${token}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getInvitesByCompany = async (companyId: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/invites/company/${companyId}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
