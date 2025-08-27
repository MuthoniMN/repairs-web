"use client"

import React, { useEffect, useState } from "react";
import { ICompany, ICompanyContact, IPaymentMethod } from "@/src/types";
import { deletePaymentMethod, getCompanyContactInfo, getCompanyDetails, getCompanyPaymentMethods } from "@/src/actions/company";
import InputContainer from "@/src/components/InputContainer";
import useAuthStore from "@/src/stores/authStore";

type SettingsTabs = "company" | "contacts" | "payments";

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTabs>("company");
    const [company, setCompany] = useState<ICompany>({} as ICompany);
    const [contacts, setContacts] = useState<ICompanyContact[]>([]);
    const [methods, setMethods] = useState<IPaymentMethod[]>([]);
    const { accessToken } = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
            const res = await getCompanyDetails(accessToken);
            const result = await getCompanyContactInfo(accessToken);
            const results = await getCompanyPaymentMethods(accessToken);

            if (res.success) {
                setCompany(res.data);
            }
            if (result.success) {
                setContacts(result.data)
            }
            if (results.success) {
                setMethods(res.data)
            }
        }

        fetchData();
    }, [])

    // --- COMPANY UPDATE ---
    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompany({ ...company, [e.target.name]: e.target.value });
    };

    // --- CONTACTS ---
    const addContact = () => {
        const newContact: ICompanyContact = {
            id: Date.now().toString(),
            phoneNumber: "",
            ussdCode: "",
            email: "",
            company,
            created_at: new Date().toISOString(),
        };

    };

    const updateContact = (id: string, updated: Partial<ICompanyContact>) => {
        const update = [...contacts.filter(cont => cont.id === id), updated as ICompanyContact]
        setContacts(update);
    };

    const deleteContact = (id: string) => {
        const update = [...contacts.filter(cont => cont.id === id)]
        setContacts(update);
    };

    // --- PAYMENT METHODS ---
    const addPayment = (method: IPaymentMethod) => {
        const update = [...methods, method]
        setMethods(update);
    };

    const updatePayment = (id: string, updated: Partial<IPaymentMethod>) => {
        const update = [...methods.filter(cont => cont.id === id), updated as IPaymentMethod]
        setMethods(update);
    };

    const deletePayment = async (id: string) => {
        const update = [...methods.filter(cont => cont.id === id)]
        setMethods(update);
    };

    return (
        <div className="p-6 text-black">
            {/* Tabs */}
            <div className="flex space-x-6 border-b">
                {["company", "contacts", "payments"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as SettingsTabs)}
                        className={`pb-2 ${activeTab === tab ? "border-b-2 border-blue-600 font-semibold" : "text-gray-500"
                            }`}
                    >
                        {tab === "company" ? "Company Info" : tab === "contacts" ? "Contacts" : "Payment Methods"}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="mt-6">
                {activeTab === "company" && (
                    <div className="space-y-4">
                        <InputContainer
                            label="Company Name"
                            value={company.companyName}
                            setValue={() => { }}
                            placeholder="ABC Corp"
                        />
                        <InputContainer
                            label="Location"
                            value={company.location}
                            setValue={() => { }}
                            placeholder="Nairobi CBD"
                        />
                        <InputContainer
                            label="Logo URL"
                            value={company.logo}
                            setValue={() => { }}
                            placeholder="Your company's logo"
                        />
                        <InputContainer
                            label="Letterhead URL"
                            value={company.letterhead}
                            setValue={() => { }}
                            placeholder="Your company's letterhead"
                        />
                    </div>
                )}

                {activeTab === "contacts" && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">Contacts</h3>
                            <button onClick={addContact} className="px-3 py-1 bg-blue-500 text-white rounded">
                                + Add Contact
                            </button>
                        </div>
                        {contacts.length ? (
                            <ul className="space-y-3">
                                {contacts.map((c) => (
                                    <li key={c.id} className="p-3 border rounded flex justify-between items-center">
                                        <div>
                                            <input
                                                value={c.phoneNumber}
                                                onChange={(e) => updateContact(c.id!, { phoneNumber: e.target.value })}
                                                className="border p-1 mr-2"
                                                placeholder="Phone Number"
                                            />
                                            <input
                                                value={c.ussdCode}
                                                onChange={(e) => updateContact(c.id!, { ussdCode: e.target.value })}
                                                className="border p-1 mr-2"
                                                placeholder="USSD Code"
                                            />
                                            <input
                                                value={c.email}
                                                onChange={(e) => updateContact(c.id!, { email: e.target.value })}
                                                className="border p-1"
                                                placeholder="Email"
                                            />
                                        </div>
                                        <button onClick={() => deleteContact(c.id!)} className="text-red-600">
                                            Delete
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No contacts configured</p>
                        )}
                    </div>
                )}

                {activeTab === "payments" && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">Payment Methods</h3>
                            <button onClick={addPayment} className="px-3 py-1 bg-blue-500 text-white rounded">
                                + Add Method
                            </button>
                        </div>
                        {methods?.length ? (
                            <ul className="space-y-3">
                                {methods.map((p) => (
                                    <li key={p.id} className="p-3 border rounded flex justify-between items-center">
                                        <div className="space-y-1">
                                            <select
                                                value={p.methodName}
                                                onChange={(e) => updatePayment(p.id!, { methodName: e.target.value as any })}
                                                className="border p-1 mr-2"
                                            >
                                                <option value="cash">Cash</option>
                                                <option value="mpesa">M-Pesa</option>
                                                <option value="bank-transfer">Bank Transfer</option>
                                            </select>
                                            <input
                                                value={p.description}
                                                onChange={(e) => updatePayment(p.id!, { description: e.target.value })}
                                                className="border p-1 mr-2"
                                                placeholder="Description"
                                            />
                                            <input
                                                value={p.accountDetails}
                                                onChange={(e) => updatePayment(p.id!, { accountDetails: e.target.value })}
                                                className="border p-1"
                                                placeholder="Account Details"
                                            />
                                        </div>
                                        <button onClick={() => deletePayment(p.id!)} className="text-red-600">
                                            Delete
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No payment methods configured</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsPage;
