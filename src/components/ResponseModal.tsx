import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Modal = ({ isOpen, onClose, type, title, message, children }: {
    isOpen: boolean,
    onClose: () => void,
    type: 'success' | 'error',
    title: string,
    message: string,
    children?: React.ReactNode
}) => {
    if (!isOpen) return null;

    const isSuccess = type === 'success';
    const isError = type === 'error';

    const iconColor = isSuccess ? 'text-green-500' : 'text-red-500';
    const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
    const borderColor = isSuccess ? 'border-green-200' : 'border-red-200';
    const buttonColor = isSuccess
        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
        : 'bg-red-600 hover:bg-red-700 focus:ring-red-500';

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                    {/* Header */}
                    <div className={`${bgColor} ${borderColor} border-b px-6 py-4`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {isSuccess && <CheckCircle className={`h-6 w-6 ${iconColor}`} />}
                                {isError && <XCircle className={`h-6 w-6 ${iconColor}`} />}
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {title}
                                </h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4">
                        {message && (
                            <p className="text-sm text-gray-600 mb-4">
                                {message}
                            </p>
                        )}
                        {children}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end space-x-3 bg-gray-50 px-6 py-4">
                        <button
                            onClick={onClose}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onClose}
                            className={`rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColor}`}
                        >
                            {isSuccess ? 'Continue' : 'Try Again'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;