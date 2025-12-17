export function mapFacilityType(code?: string): string {
    if (!code) return "기타";

    if (code.startsWith("A0")) return "요양원";
    if (code.startsWith("B0")) return "재가노인복지시설";
    if (code.startsWith("C0")) return "재가장기요양기관";
    if (code.startsWith("G") || code.startsWith("M")
        || code.startsWith("H") || code.startsWith("I")) return "치매전담실";

    return "기타";
}

