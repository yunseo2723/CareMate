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
        <div className="relative w-full max-w-md">
            <input
                value={query}
                onChange={(e) => search(e.target.value)}
                placeholder="요양원 이름을 입력하세요"
                className="
          w-full
          rounded-full
          border
          border-black
          px-5
          py-3.5
          text-sm
          font-medium
          placeholder:text-slate-950
          shadow-sm
        "
            />

            {open && results.length > 0 && (
                <div className="absolute z-20 mt-1 w-full bg-white border rounded-md shadow max-h-64 overflow-auto">
                    {results.map((f) => (
                        <div
                            key={f.instCode}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                            onClick={() => select(f)}
                        >
                            <div className="text-sm font-medium">{f.name}</div>
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
