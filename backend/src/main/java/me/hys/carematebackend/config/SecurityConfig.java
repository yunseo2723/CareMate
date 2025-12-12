package me.hys.carematebackend.config;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.user.CustomUserDetails;
import me.hys.carematebackend.repository.FacilityAdminRepository;
import me.hys.carematebackend.repository.LtcFacilityRepository;
import me.hys.carematebackend.repository.UserRepository;
import me.hys.carematebackend.util.JWTFilter;
import me.hys.carematebackend.util.JWTUtil;
import me.hys.carematebackend.util.LoginFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;
    private final FacilityAdminRepository facilityAdminRepository;
    private final LtcFacilityRepository ltcFacilityRepository;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return username -> userRepository.findByUsername(username)
                .map(CustomUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("user not found: " + username));
    }

    @Bean
    public DaoAuthenticationProvider daoAuthProvider(UserDetailsService uds, BCryptPasswordEncoder pe) {
        var p = new DaoAuthenticationProvider();
        p.setUserDetailsService(uds);
        p.setPasswordEncoder(pe);
        return p;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationConfiguration authCfg) throws Exception {

        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .formLogin(f -> f.disable())
                .httpBasic(h -> h.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()                 // ⭐ Preflight 허용
                        .requestMatchers("/actuator/health", "/users/register", "/users/login",
                                "/signup/**", "/facilities/**", "/ltc/**").permitAll()
                        .requestMatchers("/users/me/**", "/admin/verify/**",
                                "/contacts/**","/bookmarks/**", "/reviews/**", "/facility/**").authenticated()
                        .anyRequest().authenticated()
                )
                .authenticationProvider(daoAuthProvider(userDetailsService(userRepository), passwordEncoder()));

        // JWTFilter 추가
        http.addFilterBefore(new JWTFilter(jwtUtil, userRepository), UsernamePasswordAuthenticationFilter.class);

        // LoginFilter 추가
        var loginFilter = new LoginFilter(jwtUtil, facilityAdminRepository, ltcFacilityRepository);
        loginFilter.setAuthenticationManager(authCfg.getAuthenticationManager());
        loginFilter.setFilterProcessesUrl("/users/login");
        http.addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /** 공식 CORS 설정 (단 하나만 유지) */
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")); // ⭐ PATCH 반드시 포함
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);
        config.addExposedHeader("accessToken");
        config.addExposedHeader("refreshToken");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
