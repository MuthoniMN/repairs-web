"use server";

import { apiClient } from "./apiClient";
import { ICompany } from "../types/index";

export const getCompanyDetails = async (accessToken?: string) => {
    try {
        const data = await apiClient('/company', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateCompanyDetails = async (companyData: Partial<ICompany>, accessToken?: string) => {
    try {
        const data = await apiClient('/company', {
            method: 'PUT',
            body: JSON.stringify(companyData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const addContactInfo = async (contactInfoData: any, accessToken?: string) => {
    try {
        const data = await apiClient('/company/contact', {
            method: 'POST',
            body: JSON.stringify(contactInfoData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateContactInfo = async (id: string, contactInfoData: any, accessToken?: string) => {
    try {
        const data = await apiClient(`/company/contact/${id}`, {
            method: 'PUT',
            body: JSON.stringify(contactInfoData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deleteContactInfo = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/company/contact/${id}`, {
            method: 'DELETE',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const addPaymentMethod = async (paymentMethodData: any, accessToken?: string) => {
    try {
        const data = await apiClient('/company/payment-method', {
            method: 'POST',
            body: JSON.stringify(paymentMethodData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updatePaymentMethod = async (id: string, paymentMethodData: any, accessToken?: string) => {
    try {
        const data = await apiClient(`/company/payment-method/${id}`, {
            method: 'PUT',
            body: JSON.stringify(paymentMethodData),
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deletePaymentMethod = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/company/payment-method/${id}`, {
            method: 'DELETE',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getCompanyContactInfo = async (accessToken?: string) => {
    try {
        const data = await apiClient('/company/contact', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getCompanyPaymentMethods = async (accessToken?: string) => {
    try {
        const data = await apiClient('/company/payment-method', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
