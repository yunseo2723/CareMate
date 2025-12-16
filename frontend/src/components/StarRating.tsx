// src/components/review/StarRating.tsx
type StarRatingProps = {
    value: number;
    onChange?: (v: number) => void; // 선택
    readOnly?: boolean;
};

export default function StarRating({
                                       value,
                                       onChange,
                                       readOnly = false,
                                   }: StarRatingProps) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => {
                const active = n <= value;

                return (
                    <span
                        key={n}
                        className={`text-2xl select-none ${
                            active ? "text-yellow-400" : "text-gray-300"
                        } ${
                            readOnly
                                ? "cursor-default"
                                : "cursor-pointer hover:scale-110 transition"
                        }`}
                        onClick={() => {
                            if (!readOnly && onChange) {
                                onChange(n);
                            }
                        }}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
}
