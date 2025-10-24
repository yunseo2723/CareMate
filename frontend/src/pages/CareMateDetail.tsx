// src/pages/CareMateDetail.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchFacilityDetail } from "../api/ltc";

export default function CareMateDetail() {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        let alive = true;
        (async()=>{
            try{
                const d = await fetchFacilityDetail(id!);
                if(alive) setData(d);
            } finally {
                if(alive) setLoading(false);
            }
        })();
        return ()=>{ alive=false; };
    },[id]);

    if (loading) return <div>불러오는 중...</div>;
    if (!data) return <div>데이터가 없습니다.</div>;

    return (
        <div className="rounded-2xl border bg-white p-6">
            <h2 className="text-xl font-semibold">{data.name}</h2>
            <div className="mt-2 text-sm text-slate-600">{data.address}</div>
            <div className="mt-1 text-sm">전화: {data.phone}</div>
            {/* 필요 섹션: 일반현황/수용인원/비급여/프로그램 등… */}
        </div>
    );
}
