// src/components/review/StarRating.tsx
export default function StarRating({value, onChange}: {
    value: number;
    onChange: (v: number) => void;
}) {
    return (
        <div className="flex gap-1">
            {[1,2,3,4,5].map(n => (
                <span
                    key={n}
                    className={`cursor-pointer text-2xl ${
                        n <= value ? "text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => onChange(n)}
                >
                    ★
                </span>
            ))}
        </div>
    );
}
