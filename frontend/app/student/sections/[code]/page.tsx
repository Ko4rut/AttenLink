'use client';

import {useParams} from 'next/navigation';
import Header from '@/app/student/sections/components/Header';
import Body from '@/app/student/sections/[code]/components/body';
import Footer from '@/app/student/sections/[code]/components/footer';



export default function SectionDetailPage() {
    const params = useParams();
    const code = params.code as string;


    const handleLogout = () => {
        const path = window.location.pathname.split("/")
        path.pop() // xoá phần tử cuối

        const newPath = path.join("/")
        console.log(newPath)
        for (let i = 0; i < path.length; i++) {
            console.log(path[i])
        }
        window.location.href = `${newPath}`;
    };

    const sectionDetail = {
        sectionName: 'Data Structure Algorithms',
        attendance: '1/2',
        sessions: [
            {
                id: 1,
                title: 'Session 1',
                date: 'April 1, 2024',
                checkIn: '18:00:00',
                status: 'Attended',
            },
            {
                id: 2,
                title: 'Session 2',
                date: 'April 1, 2024',
                checkIn: '18:00:00',
                status: 'Absent',
            },
        ],
    };

    const handleScanQR = () => {
        window.location.href =  window.location.pathname+"/scanner";
    };

    return (
        <div className="flex min-h-screen flex-col justify-between bg-[#DCE3E6]">
            <Header onLogout={handleLogout} />
            <Body
                sectionName={sectionDetail.sectionName}
                code={code}
                attendance={sectionDetail.attendance}
                sessions={sectionDetail.sessions}
            />\
            <Footer onScanQR={handleScanQR} />
        </div>
    );
}