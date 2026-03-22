import Link from "next/link"
type section = {
    code: string,
    name: string,
    enrolled: number,
    totalSessions: number
}


type Props = {
    data: section[]
}


export default function Table_Components({ data }: Props) {
    return (
        <div className="overflow-x-auto h-106 rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#09637E] text-white">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Code</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Student Enrolled</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Total Sessions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((items, index) => (
                        <Link
                            key={items.code}
                            href={`/auth/sections/${items.code}`}
                            className="contents"
                        >
                            <tr
                                key={index}
                                className="bg-white hover:bg-[#7AB2B2]/30 transition-colors cursor-pointer"

                            >
                                <td className="px-6 py-4 h-13 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {items.code}
                                </td>
                                <td className="px-6 py-4 h-13  whitespace-nowrap text-sm text-gray-700">
                                    {items.name}
                                </td>
                                <td className="px-6 py-4 h-13 whitespace-nowrap text-sm text-gray-700">
                                    {items.enrolled}
                                </td>
                                <td className="px-6 py-4 h-13 whitespace-nowrap text-sm text-gray-700">
                                    {items.totalSessions}
                                </td>
                            </tr>
                        </Link>
                    ))}
                </tbody>
            </table>
        </div>
    )
}