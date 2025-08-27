export default function FileInput({ label, multiple = false }: { label: string, multiple?: boolean }) {
    return (

        <div className="flex flex-col gap-2 text-black">
            <label className={`font-medium`}>{label}</label>
            <input
                type="file"
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50
         file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
         file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700
         hover:file:bg-cyan-100"
                multiple={multiple}
            />
        </div>
    )
}