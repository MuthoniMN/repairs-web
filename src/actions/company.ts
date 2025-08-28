"use server";

import { apiClient } from "./apiClient";
import { ICompany } from "../types/index";

export const getCompanyDetails = async (accessToken?: string) => {
    try {
        const data = await apiClient('/company', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
};

export const updateCompanyDetails = async (companyData: Partial<ICompany>, accessToken?: string) => {
    try {
        const data = await apiClient('/company', {
            method: 'PUT',
            body: JSON.stringify(companyData),
        }, accessToken);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
};
/* eslint-disable @typescript-eslint/no-explicit-any */
export const addContactInfo = async (contactInfoData: any, accessToken?: string) => {
    try {
        const data = await apiClient('/company/contact', {
            method: 'POST',
            body: JSON.stringify(contactInfoData),
        }, accessToken);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const updateContactInfo = async (id: string, contactInfoData: any, accessToken?: string) => {
    try {
        const data = await apiClient(`/company/contact/${id}`, {
            method: 'PUT',
            body: JSON.stringify(contactInfoData),
        }, accessToken);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
};

export const deleteContactInfo = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/company/contact/${id}`, {
            method: 'DELETE',
        }, accessToken);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const addPaymentMethod = async (paymentMethodData: any, accessToken?: string) => {
    try {
        const data = await apiClient('/company/payment-method', {
            method: 'POST',
            body: JSON.stringify(paymentMethodData),
        }, accessToken);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const updatePaymentMethod = async (id: string, paymentMethodData: any, accessToken?: string) => {
    try {
        const data = await apiClient(`/company/payment-method/${id}`, {
            method: 'PUT',
            body: JSON.stringify(paymentMethodData),
        }, accessToken);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
};

export const deletePaymentMethod = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/company/payment-method/${id}`, {
            method: 'DELETE',
        }, accessToken);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
};

export const getCompanyContactInfo = async (accessToken?: string) => {
    try {
        const data = await apiClient('/company/contacts', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
};

export const getCompanyPaymentMethods = async (accessToken?: string) => {
    try {
        const data = await apiClient('/company/payment-methods', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
};
