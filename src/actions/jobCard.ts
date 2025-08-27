"use server";

import { apiClient } from "./apiClient";
import { IJobCard } from "../types/index";

export const getAllJobCards = async (accessToken: string) => {
    try {
        const data = await apiClient('/job-cards', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getJobCardById = async (id: string, accessToken: string) => {
    try {
        const data = await apiClient(`/job-cards/${id}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getJobCardsByJobId = async (jobId: string, accessToken: string) => {
    try {
        const data = await apiClient(`/job-cards/job/${jobId}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getJobCardsByContractorId = async (contractorId: string, accessToken: string) => {
    try {
        const data = await apiClient(`/job-cards/contractor/${contractorId}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const createJobCard = async (jobCardData: Omit<IJobCard, 'id' | 'created_at' | 'updated_at'>, accessToken: string) => {
    try {
        const data = await apiClient('/job-cards', {
            method: 'POST',
            body: JSON.stringify(jobCardData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateJobCard = async (id: string, jobCardData: Partial<IJobCard>, accessToken: string) => {
    try {
        const data = await apiClient(`/job-cards/${id}`, {
            method: 'PUT',
            body: JSON.stringify(jobCardData),
        });
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deleteJobCard = async (id: string, accessToken: string) => {
    try {
        const data = await apiClient(`/job-cards/${id}`, {
            method: 'DELETE',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateJobCardStatus = async (id: string, status: IJobCard['status'], accessToken: string) => {
    try {
        const data = await apiClient(`/job-cards/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const addAttachmentToJobCard = async (jobCardId: string, attachmentData: { link: string }, accessToken: string) => {
    try {
        const data = await apiClient(`/job-cards/${jobCardId}/attachments`, {
            method: 'POST',
            body: JSON.stringify(attachmentData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const removeAttachmentFromJobCard = async (jobCardId: string, attachmentId: string, accessToken: string) => {
    try {
        const data = await apiClient(`/job-cards/${jobCardId}/attachments/${attachmentId}`, {
            method: 'DELETE',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const addProductToJobCard = async (jobCardId: string, productData: { productId: string; quantity: number }, accessToken: string) => {
    try {
        const data = await apiClient(`/job-cards/${jobCardId}/products`, {
            method: 'POST',
            body: JSON.stringify(productData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const removeProductFromJobCard = async (jobCardId: string, productId: string) => {
    try {
        const data = await apiClient(`/job-cards/${jobCardId}/products/${productId}`, {
            method: 'DELETE',
        });
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getJobCardAnalytics = async (timeframe: 'day' | 'week' | 'month' | 'year' = 'month') => {
    try {
        const data = await apiClient(`/job-cards/analytics?timeframe=${timeframe}`, {
            method: 'GET',
        });
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getJobCardStats = async () => {
    try {
        const data = await apiClient('/job-cards/stats', {
            method: 'GET',
        });
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
