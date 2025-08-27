export interface IUser {
    id?: string,
    name: string,
    email: string,
    phoneNumber: string,
    password?: string,
    profilePicture: string,
    role?: IRole | string,
    created_at?: string,
    updated_at?: string
}

export interface IRole {
    id?: string,
    title: string,
    description: string,
    permissions: IPermission[],
    created_at: string,
    updated_at?: string
}

export interface IPermission {
    id: string,
    title: string,
    created_at: string,
    updated_at: string
}

export interface IClient {
    id?: string,
    name: string,
    email: string,
    phoneNumber: string,
    location: string,
    added_by?: IUser,
    created_at?: string,
    updated_at?: string
}

export interface IJob {
    id?: string,
    slug?: string,
    title: string,
    description: string,
    progress?: string,
    status: 'draft' | 'pending' | 'in-progress' | 'completed' | 'payment-pending' | 'payment-complete' | 'finalized',
    priority: 'high' | 'low' | 'medium',
    client: IClient,
    due_date: string,
    products?: ISale[],
    cards?: IJobCard[],
    contractors?: IContractor[],
    added_by?: IUser,
    created_at?: string,
    updated_at?: string
}

export interface IContractor {
    id?: string,
    name: string,
    email: string,
    expertise: string,
    phoneNumber: string,
    location: string,
    specialties: string,
    rating: number,
    status?: 'available' | 'busy' | 'unavailable',
    profile_picture?: string,
    last_paid_on?: string,
    added_by?: IUser,
    created_at?: string,
    updated_at?: string
}

export interface IJobCard {
    id: string,
    job: IJob,
    contractor: IContractor,
    price: number,
    title: string,
    description: string,
    attachments: IAttachment[],
    status: 'draft' | 'pending' | 'in-progress' | 'completed',
    products?: IProduct[],
    logged_by?: IUser,
    created_at: string,
    updated_at: string
}

export interface IAttachment {
    id: string,
    link: string,
    uploaded_by?: string,
    created_at: string,
    updated_at: string
}

export interface ISupplier {
    id?: string,
    company: string,
    location: string,
    products?: IProduct[],
    leadTime: number,
    email: string,
    phoneNumber: string,
    added_by?: IUser,
    created_at?: string,
    updated_at?: string
}

export interface IStock {
    id?: string,
    product: IProduct,
    supplier: ISupplier,
    quantity: number,
    batch_number: string,
    logged_by?: IUser,
    created_at?: string,
    updated_at?: string
}

export interface IProduct {
    id?: string,
    title: string,
    description: string,
    unitPrice: number,
    sku: string,
    quantity: number,
    category: string,
    reorderLevel: number,
    reorderQuantity: number,
    sellingPrice: number,
    profit?: number,
    brand: string,
    attachments: IAttachment[],
    supplier: ISupplier[],
    added_by?: IUser,
    created_at?: string,
    updated_at?: string
}

export interface ISale {
    id?: string,
    product: IProduct,
    job?: IJob,
    quantity: number,
    price: number,
    status: 'pending' | 'ordered' | 'received' | 'used',
    documents: IAttachment[],
    tax: number,
    logged_by?: IUser,
    client?: IClient,
    created_at: string,
    updated_at: string
}

export interface IInvoice {
    id?: string,
    products?: ISale[],
    job?: IJob,
    cards?: IJobCard[],
    title: string,
    slug: string,
    issued_on?: string,
    status?: 'pending' | 'partially-paid' | 'settled',
    last_paid_on?: string,
    tax: number,
    total: number,
    created_at?: string,
    updated_at?: string,
}

export interface IPayment {
    id?: string,
    invoice?: IInvoice,
    amount: number,
    ref: string,
    method: 'cash' | 'mpesa' | 'bank-transfer',
    created_at?: string,
    updated_at?: string
}

export interface IExpense {
    id?: string,
    invoice?: IInvoice,
    amount: number,
    ref: string,
    user_type?: 'supplier' | 'contractor',
    method: 'cash' | 'mpesa' | 'bank-transfer',
    jobCard?: IJobCard,
    stock?: IStock,
    contractor?: IContractor,
    supplier?: ISupplier,
    created_at?: string,
    updated_at?: string
}

export interface ICompany {
    id?: string,
    companyName: string,
    location: string,
    logo: string,
    letterhead: string,
    contactInfos: ICompanyContact,
    paymentMethods: IPaymentMethod,
    created_at?: string,
    updated_at?: string
}

export interface ICompanyContact {
    id?: string,
    phoneNumber: string,
    ussdCode: string,
    email: string,
    company: ICompany,
    created_at?: string,
    updated_at?: string
}

export interface IPaymentMethod {
    id?: string,
    methodName?: 'cash' | 'mpesa' | 'bank-transfer',
    description: string,
    accountDetails: string,
    company: ICompany,
    created_at?: string,
    updated_at?: string
}

export interface IInvite {
    id?: string,
    email: string,
    expiresAt: string,
    role: IRole | string,
    token?: string,
    used?: boolean,
    invited_by?: IUser,
    company?: ICompany,
    created_at?: string,
    updated_at?: string
}

export type DashboardSummary = {
    overview: {
        totalProducts: number;
        totalInvoices: number;
        totalPayments: number;
        totalExpenses: number;
        totalRevenue: number;
        totalExpenseAmount: number;
        netProfit: number;
    };
    inventory: {
        lowStockCount: number;
        totalStockValue: number;
        lowStockProducts: {
            id: number | string;
            title: string;
            quantity: number;
            reorderLevel: number;
        }[];
    };
    financials: {
        revenue: {
            total: number;
            daily: number;
            weekly: number;
            monthly: number;
            average: number;
        };
        expenses: {
            total: number;
            daily: number;
            weekly: number;
            monthly: number;
            average: number;
            supplierTotal: number;
            contractorTotal: number;
        };
        paymentMethods: Record<string, number>; // e.g. { cash: 1200, card: 3000 }
        expenseTypes: Record<string, number>;   // e.g. { utilities: 500, rent: 2000 }
    };
    alerts: {
        overdueInvoices: {
            id: number | string;
            ref: string;
            amount: number;
            dueDate: string | Date;
        }[];
        lowStockCount: number;
    };
    recentActivity: {
        payments: {
            id: number | string;
            amount: number;
            method: string;
            created_at: string | Date;
        }[];
        expenses: {
            id: number | string;
            amount: number;
            method: string;
            created_at: string | Date;
        }[];
    };
    analytics: {
        salesByProduct: Record<string, number>;
        invoicesByStatus: Record<string, number>;
        paymentsByMethod: Record<string, number>;
        expensesByType: Record<string, number>;
    };
};
