"use server";

import { apiClient } from "./apiClient";
import { IExpense } from "../types/index";

export const getAllExpenses = async (accessToken?: string) => {
    try {
        const data = await apiClient('/expenses', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getExpenseById = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/expenses/${id}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const createExpense = async (expenseData: IExpense, accessToken?: string) => {
    try {
        const data = await apiClient('/expenses', {
            method: 'POST',
            body: JSON.stringify(expenseData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateExpense = async (id: string, expenseData: IExpense, accessToken?: string) => {
    try {
        const data = await apiClient(`/expenses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(expenseData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deleteExpense = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/expenses/${id}`, {
            method: 'DELETE',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getRecentExpenses = async (limit: number = 10, accessToken?: string) => {
    try {
        const data = await apiClient(`/expenses/recent?limit=${limit}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getExpenseSummary = async (accessToken?: string) => {
    try {
        const data = await apiClient('/expenses/analytics/summary', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
