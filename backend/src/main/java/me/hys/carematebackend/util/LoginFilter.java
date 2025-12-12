package me.hys.carematebackend.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.code.ErrorCode;
import me.hys.carematebackend.code.ResponseCode;
import me.hys.carematebackend.dto.response.ErrorResponseDTO;
import me.hys.carematebackend.dto.response.ResponseDTO;
import me.hys.carematebackend.dto.user.CustomUserDetails;
import me.hys.carematebackend.dto.user.ResponseUserDto;
import me.hys.carematebackend.model.User;
import me.hys.carematebackend.repository.FacilityAdminRepository;
import me.hys.carematebackend.repository.LtcFacilityRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final JWTUtil jwtUtil;
    private final FacilityAdminRepository facilityAdminRepository;
    private final LtcFacilityRepository ltcFacilityRepository;
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {

        String username = obtainUsername(request);
        String password = obtainPassword(request);

        var authToken = new UsernamePasswordAuthenticationToken(username, password);
        System.out.println(authToken);
        return getAuthenticationManager().authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException {
        CustomUserDetails cud = (CustomUserDetails) authentication.getPrincipal();
        User user = cud.getUser();

        System.out.println("✅ JWT 생성: username=" + user.getUsername() + ", nickname=" + user.getNickname());

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = jwtUtil.createJwt("accessToken", user.getUsername(), user.getNickname(),86400000L);
        String refreshToken = jwtUtil.createJwt("refreshToken", user.getUsername(), user.getNickname(), 86400000L);

        System.out.println("✅ accessToken = " + accessToken);

        response.setHeader("accessToken", "Bearer " + accessToken);
        response.setHeader("refreshToken", "Bearer " + refreshToken);

        // ✅ 관리자 시설 ID 조회
        List<String> instCodes = facilityAdminRepository
                .findByUserId(user.getId())
                .stream()
                .map(a -> a.getInstCode())
                .toList();

        // 2) instCode → 시설 이름 변환
        List<ResponseUserDto.FacilityInfo> facilities =
                instCodes.stream()
                        .map(code -> {
                            var fac = ltcFacilityRepository.findByInstCode(code).orElse(null);
                            return new ResponseUserDto.FacilityInfo(
                                    code,
                                    fac != null ? fac.getName() : "(이름 없음)"
                            );
                        })
                        .toList();

        // 3) DTO 생성
        ResponseUserDto userDto = ResponseUserDto.of(user, facilities);

        // 🔹 응답 객체 구성 (userDto 포함)
        ResponseDTO<Object> res = new ResponseDTO<>(ResponseCode.SUCCESS_LOGIN, userDto);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonResponse = objectMapper.writeValueAsString(res);
        response.getWriter().write(jsonResponse);
    }


    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException {

        response.setStatus(401);

        ErrorResponseDTO responseDTO = new ErrorResponseDTO(ErrorCode.USER_NOT_FOUND);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonResponse = objectMapper.writeValueAsString(responseDTO);
        response.getWriter().write(jsonResponse);
    }
}