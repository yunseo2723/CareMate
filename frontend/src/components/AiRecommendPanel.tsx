// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { useAuth } from "../hooks/useAuth";
//
// export default function AiRecommendPanel({
//                                              filterPayload,
//                                              onResult,
//                                          }: {
//     filterPayload: any;
//     onResult: (res: any) => void;
// }) {
//     const { authFetch } = useAuth();
//     const [message, setMessage] = useState("");
//     const [loading, setLoading] = useState(false);
//
//     const submit = async () => {
//         if (!message.trim()) return;
//
//         setLoading(true);
//         const res = await authFetch("http://localhost:8080/ai/recommend", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 message,
//                 filter: filterPayload,
//             }),
//         });
//
//         const data = await res.json();
//         onResult(data);
//         setLoading(false);
//     };
//
//     return (
//         <div className="rounded-2xl border bg-white p-5 space-y-3">
//             <h2 className="text-lg font-bold">🤖 AI 맞춤 추천</h2>
//
//             <textarea
//                 className="w-full border rounded-md p-3 text-sm"
//                 rows={3}
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="예) 치매가 있고 운동 프로그램이 잘 된 서울 근교 요양원"
//             />
//
//             <button
//                 className="w-full bg-slate-900 text-white py-3 rounded-md font-semibold"
//                 onClick={submit}
//                 disabled={loading}
//             >
//                 {loading ? "추천 중..." : "추천 받기"}
//             </button>
//         </div>
//     );
// }
