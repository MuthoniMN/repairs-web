"use server";

import { apiClient } from "./apiClient";

export const getDashboardData = async (accessToken?: string) => {
    try {
        const data = await apiClient('/dashboard', {
            method: 'GET',
        }, accessToken);

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getFinancialSummary = async (accessToken?: string) => {
    try {
        const data = await apiClient('/dashboard/financial-summary', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getInventoryOverview = async (accessToken?: string) => {
    try {
        const data = await apiClient('/dashboard/inventory-overview', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getRecentActivity = async (accessToken?: string) => {
    try {
        const data = await apiClient('/dashboard/recent-activity', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
