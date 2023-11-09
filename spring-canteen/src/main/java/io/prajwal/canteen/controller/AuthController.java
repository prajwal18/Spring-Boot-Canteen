package io.prajwal.canteen.controller;
import io.prajwal.canteen.config.CustomUserDetailsManagementService;
import io.prajwal.canteen.model.AuthReq;
import io.prajwal.canteen.model.AuthRes;
import io.prajwal.canteen.model.SecurityUser;
import io.prajwal.canteen.model.UserEntity;
import io.prajwal.canteen.util.JwtUtil;
import io.prajwal.canteen.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsManagementService customUserDetailsManagementService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthReq authReq) throws Exception{
        try{
            authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(authReq.getUsername(), authReq.getPassword())
            );
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final SecurityUser user = customUserDetailsManagementService.loadUserByUsername(authReq.getUsername());
        final String jwt = jwtUtil.generateToken(user);
        List<String> roles = user.getAuthorities().stream().map(Object::toString).toList();

        return  ResponseEntity.ok(new AuthRes(jwt, user.getUsername(), user.getId(), roles));
    }

    // Checks to see if the jwt is valid and if so returns user's session info.
    @GetMapping("/session-info")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuthRes> getSessionInfo(@RequestHeader("Authorization") String token){
        String jwtToken = token.substring(7);
        String username = jwtUtil.extractUsername(jwtToken);
        final SecurityUser user = customUserDetailsManagementService.loadUserByUsername(username);
        List<String> roles = user.getAuthorities().stream().map(Object::toString).toList();
        return  ResponseEntity.ok(new AuthRes("", user.getUsername(), user.getId(), roles));
    }
}
