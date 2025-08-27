"use server";

import { apiClient } from "./apiClient";
import { IJob } from "../types/index";

export const getAllJobs = async (accessToken?: string) => {
    try {
        const data = await apiClient('/jobs', {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getJobById = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/jobs/${id}`, {
            method: 'GET',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const createJob = async (jobData: IJob, accessToken?: string) => {
    try {
        const data = await apiClient('/jobs', {
            method: 'POST',
            body: JSON.stringify(jobData),
        }, accessToken);

        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        console.log(error);

        return { success: false, error: error.message };
    }
};

export const updateJob = async (id: string, jobData: IJob, accessToken?: string) => {
    try {
        const data = await apiClient(`/jobs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(jobData),
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deleteJob = async (id: string, accessToken?: string) => {
    try {
        const data = await apiClient(`/jobs/${id}`, {
            method: 'DELETE',
        }, accessToken);
        return { success: true, data };
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
