import { IJob } from "@/src/types";

export default function JobItem({ job }: { job: IJob }) {
    return (
        <div className="flex flex-col gap-4 w-full md:w-2/5 lg:w-1/3 shadow-md rounded-md py-2 px-4">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                    <h3 className="text-md font-semibold">{job.title}</h3>
                    <p className="text-sm text-slate-500">{job.slug}</p>
                </div>
                <div className={` py-2 px-6 flex justify-center items-center font-medium
                    ${job.status == 'draft' ? 'bg-gray-200 text-slate-700' :
                        job.status == 'pending' ? 'bg-yellow-100 text-yellow-500' :
                            job.status == 'completed' || job.status == 'payment-complete' ? 'bg-emerald-100 text-emerald-600' :
                                job.status == 'payment-pending' || job.status == 'in-progress' ? 'bg-orange-100 text-orange-500' :
                                    'bg-green-200 bg-green-500'
                    }
                    `}>
                    <p>{job.status}</p>
                </div>
            </div>
            <p>{job.description}</p>
            <div className="flex justify-between items-center divide-2 divide-slate-600">
                <div className="w-3/10 justify-center items-center">
                    <h4 className="font-medium text-sm">Products Bought</h4>
                    <p className="text-lg">{job.products?.length || 0}</p>
                </div>
                <div className="w-3/10 justify-center items-center">
                    <h4 className="font-medium text-sm">Job Cards</h4>
                    <p className="text-lg">{job.cards?.length || 0}</p>
                </div>
                <div className="w-3/10 justify-center items-center">
                    <h4 className="font-medium text-sm">Contractors</h4>
                    <p className="text-lg">{job.contractors?.length || 0}</p>
                </div>
            </div>
        </div>
    )
}