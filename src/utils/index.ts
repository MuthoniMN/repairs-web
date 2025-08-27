import { z, ZodError } from "zod";

export function maskEmail(email: string): string {
    const [name, domain] = email.split("@");
    if (name.length <= 3) {
        return name[0] + "*".repeat(name.length - 1) + "@" + domain;
    }
    return name.slice(0, 3) + "*".repeat(name.length - 3) + "@" + domain;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function validateInput<T>(schema: z.ZodSchema<any>, data: T): { isValid: boolean; errors: Record<string, string> } {
    try {
        schema.parse(data);
        return { isValid: true, errors: {} };
    } catch (error) {
        if (error instanceof ZodError) {
            const newErrors: Record<string, string> = {};
            error.issues.forEach((err) => {
                if (err.path[0]) {
                    newErrors[err.path[0] as string] = err.message;
                }
            });
            return { isValid: false, errors: newErrors };
        }
        return { isValid: false, errors: { general: "An unexpected validation error occurred" } };
    }
}
