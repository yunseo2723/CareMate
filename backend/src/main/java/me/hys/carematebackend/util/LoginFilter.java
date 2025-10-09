package me.hys.carematebackend.util;

import me.hys.carematebackend.code.ErrorCode;
import me.hys.carematebackend.code.ResponseCode;
import me.hys.carematebackend.dto.response.ErrorResponseDTO;
import me.hys.carematebackend.dto.response.ResponseDTO;
import me.hys.carematebackend.dto.user.CustomUserDetails;
import me.hys.carematebackend.dto.user.ResponseUserDto;
import me.hys.carematebackend.model.User;
import me.hys.carematebackend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {

        String username = obtainUsername(request);
        String password = obtainPassword(request);

        // 추후 삭제 필요, 확인 용
        System.out.println(username + password);

        var authToken = new UsernamePasswordAuthenticationToken(username, password);
        System.out.println(authToken);
        return getAuthenticationManager().authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException {
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        String username = customUserDetails.getUsername();
        String nickname = customUserDetails.getNickname();

        System.out.println("✅ JWT 생성: username=" + username + ", nickname=" + nickname);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = jwtUtil.createJwt("accessToken", username, nickname,86400000L);
        String refreshToken = jwtUtil.createJwt("refreshToken", username, nickname, 86400000L);

        System.out.println("✅ accessToken = " + accessToken);

        response.setHeader("accessToken", "Bearer " + accessToken);
        response.setHeader("refreshToken", "Bearer " + refreshToken);

        // 🔹 사용자 정보 조회
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("유저 정보 없음"));

        // 🔹 DTO로 변환
        ResponseUserDto userDto = ResponseUserDto.entityToDto(user);

        // 🔹 응답 객체 구성 (userDto 포함)
        ResponseDTO<Object> responseDTO = new ResponseDTO<>(ResponseCode.SUCCESS_LOGIN, userDto);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonResponse = objectMapper.writeValueAsString(responseDTO);
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