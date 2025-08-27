"use server";

const API_URL = process.env.API_URL || 'http://localhost:5000';

export const apiClient = async (endpoint: string, options: RequestInit = {}, accessToken?: string) => {
    console.log(`${API_URL}${endpoint}`, options);

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });
    console.log(response);



    if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);

        throw new Error(errorData.message || 'An error occurred');
    }

    return response.json();
};
