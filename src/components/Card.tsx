interface CardProps {
    title: string;
    children?: React.ReactNode;
    empty?: boolean;
    emptyMessage?: string;
    loading?: boolean;
}

const Card: React.FC<CardProps> = ({
    title,
    children,
    loading = false,
}) => {
    return (
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col min-h-[150px]">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>

            {loading ? (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                    <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                </div>
            ) : (
                <div className="flex-1">{children}</div>
            )}
        </div>
    );
};

export default Card;