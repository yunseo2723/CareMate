import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";

export function useRequireLogin() {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    return (action: () => void) => {
        if (!isLoggedIn) {
            toast.info("로그인 후 이용 가능합니다");

            navigate("/login", {
                state: {
                    from: location.pathname + location.search,
                },
            });
            return;
        }

        action();
    };
}
