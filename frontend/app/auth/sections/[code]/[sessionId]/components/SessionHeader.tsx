'use client';

import { FiArrowLeft } from "react-icons/fi";
import {  useParams, useRouter } from 'next/navigation';

function exp_csv( sessionId: any ){
    alert(sessionId)
}

export default function SesssionHeader(){
    const router= useRouter()
    const route = useParams()
    console.log(route)
    return(
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 cursor-pointer hover: color-gray-50 text-gray-700 hover:text-black text-lg font-medium"
          >
            <FiArrowLeft size={20} />
          </button>

          <button className="bg-[#09637E] cursor-pointer hover:bg-[#b0d1d9] text-white px-6 py-2.5 rounded-lg font-medium shadow transition flex items-center gap-2">
            <span
                onClick={()=> exp_csv(route.sessionId)}
            >Export CSV</span>
          </button>
        </div>
    )
}