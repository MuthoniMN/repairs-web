"use client"

import { IContractor } from "@/src/types";
import { CheckCircle, Clock, XCircle, User, Star, Mail, Phone, MapPin, Calendar } from "lucide-react";

interface ContractorCardProps {
    contractor: IContractor;
    onContact?: (contractor: IContractor) => void;
    onEdit?: (contractor: IContractor) => void;
    onView?: (contractor: IContractor) => void;
}

const ContractorCard: React.FC<ContractorCardProps> = ({
    contractor,
    onContact,
    onEdit,
    onView
}) => {
    console.log(contractor);

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'busy':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'unavailable':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case 'available':
                return <CheckCircle className="h-4 w-4" />;
            case 'busy':
                return <Clock className="h-4 w-4" />;
            case 'unavailable':
                return <XCircle className="h-4 w-4" />;
            default:
                return <User className="h-4 w-4" />;
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(rating)
                    ? 'text-yellow-400 fill-current'
                    : i < rating
                        ? 'text-yellow-400 fill-current opacity-50'
                        : 'text-gray-300'
                    }`}
            />
        ));
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4 w-full flex-wrap">
                <div className="flex items-start space-x-4 w-full">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                        {contractor.profile_picture ? (
                            <img
                                src={contractor.profile_picture}
                                alt={contractor.name}
                                className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                            />
                        ) : (
                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="h-6 w-6 text-gray-500" />
                            </div>
                        )}
                    </div>

                    {/* Name and Expertise */}
                    <div className="flex-1 min-w-0 grow">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {contractor.name}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">
                            {contractor.expertise}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center mt-1">
                            <div className="flex items-center space-x-1">
                                {renderStars(contractor.rating)}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                                {contractor.rating.toFixed(1)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Badge */}
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(contractor.status)}`}>
                    {getStatusIcon(contractor.status)}
                    <span className="ml-1 capitalize">
                        {contractor.status || 'unknown'}
                    </span>
                </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="truncate">{contractor.email}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{contractor.phoneNumber}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="truncate">{contractor.location}</span>
                </div>
            </div>

            {/* Specialties */}
            {contractor.specialties && contractor.specialties.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-1">
                        {contractor.specialties.split(', ').slice(0, 4).map((specialty, index) => (
                            <span
                                key={index}
                                className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md"
                            >
                                {specialty}
                            </span>
                        ))}
                        {contractor.specialties.length > 4 && (
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                                +{contractor.specialties.length - 4} more
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Footer Information */}
            <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                    <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Last paid: {formatDate(contractor.last_paid_on)}</span>
                    </div>
                    {contractor.added_by && (
                        <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            <span>Added by: {contractor.added_by.name}</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    {onView && (
                        <button
                            onClick={() => onView(contractor)}
                            className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            View Details
                        </button>
                    )}

                    {onContact && contractor.status === 'available' && (
                        <button
                            onClick={() => onContact(contractor)}
                            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Contact
                        </button>
                    )}

                    {onEdit && (
                        <button
                            onClick={() => onEdit(contractor)}
                            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContractorCard;