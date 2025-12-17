import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Facility = {
    instCode: string;
    kindCode: string;
    name: string;
    fullRoadAddr?: string;
};

export default function FacilityQuickSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Facility[]>([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const search = async (value: string) => {
        setQuery(value);

        if (!value.trim()) {
            setResults([]);
            return;
        }

        const res = await fetch(
            `https://caremate-fmp1.onrender.com/ltc/search/${encodeURIComponent(value)}`
        );
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
        setOpen(true);
    };

    const select = (f: Facility) => {
        navigate(`/facility/${f.instCode}?kindCode=${f.kindCode}`);
    };

    return (
        <div className="relative w-full max-w-xl mx-auto">
            <input
                value={query}
                onChange={(e) => search(e.target.value)}
                placeholder="요양원 이름을 입력하세요"
                className="w-[520px] md:w-[600px] lg:w-[580px] rounded-full border-2
                border-black px-10 py-5 text-lg font-semibold placeholder:text-gray-400 shadow-sm"
            />

            {open && results.length > 0 && (
                <div className="absolute z-20 w-full bg-white border rounded-md shadow mt-1 max-h-64 overflow-auto">
                    {results.map((f) => (
                        <div
                            key={f.instCode}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer"
                            onClick={() => select(f)}
                        >
                            <div className="font-medium">{f.name}</div>
                            {f.fullRoadAddr && (
                                <div className="text-xs text-gray-500">
                                    {f.fullRoadAddr}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
