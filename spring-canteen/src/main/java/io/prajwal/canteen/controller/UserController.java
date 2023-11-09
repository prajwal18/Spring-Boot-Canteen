package io.prajwal.canteen.controller;

import io.prajwal.canteen.dto.CreateUserDTO;
import io.prajwal.canteen.dto.PasswordDTO;
import io.prajwal.canteen.dto.UserDTO;
import io.prajwal.canteen.dto.dd.UserDD;
import io.prajwal.canteen.model.PageinatedResponse;
import io.prajwal.canteen.service.UserService;
import io.prajwal.canteen.util.JwtUtil;
import io.prajwal.canteen.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
public class UserController {
    // Will include extra checks later on. -- DONE --

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/users")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<PageinatedResponse<UserDTO>> findAll(Pageable pageable, @RequestParam(value = "searchTerm") String searchTerm, @RequestParam(value = "role") String role) {
        PageinatedResponse<UserDTO> response = userService.findAll(pageable, searchTerm, role);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/dd")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<UserDD>> findAllUserDD(@RequestParam String searchTerm) {
        List<UserDD> users = userService.findAllUserDD(searchTerm); // Only returns 10 at a time
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserDTO> findById(@PathVariable long userId, @RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        Long idFromToken = jwtUtil.extractId(jwtToken);
        if (userId == idFromToken || SecurityUtil.hasRole("ADMIN")) {
            UserDTO user = userService.findById(userId);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/register")
    public ResponseEntity<Void> registerCustomer(@RequestBody CreateUserDTO user, UriComponentsBuilder ucb) {
        List<String> customerRoles = List.of("CUSTOMER");
        user.setRoles(customerRoles);
        UserDTO newUser = userService.createUser(user);
        URI uri = ucb.path("/users/{userId}").buildAndExpand(newUser.getId()).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> createUser(@RequestBody CreateUserDTO user, UriComponentsBuilder ucb) {
        UserDTO newUser = userService.createUser(user);
        URI uri = ucb.path("/users/{userId}").buildAndExpand(newUser.getId()).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<Void> updateUser(@RequestBody CreateUserDTO user, @PathVariable long userId, @RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        Long idFromToken = jwtUtil.extractId(jwtToken);
        if (userId == idFromToken || SecurityUtil.hasRole("ADMIN")) {
            userService.updateUser(user, userId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // Only the user can edit their password
    @PutMapping("/users/{userId}/password")
    public ResponseEntity<?> updateUserPassword(@RequestBody PasswordDTO passwordDTO, @PathVariable long userId, @RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        Long idFromToken = jwtUtil.extractId(jwtToken);
        if (userId == idFromToken) {
            try {
                userService.changePassword(userId, passwordDTO);
                return ResponseEntity.noContent().build();
            } catch (Exception ex) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // Only the admin can edit the user's password
    @PutMapping("/users/{userId}/change-password-by-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> changePasswordByAdmin(@RequestBody PasswordDTO passwordDTO, @PathVariable long userId) {
        if (userService.existsById(userId)) {
            userService.changePasswordByAdmin(userId, passwordDTO);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Forgot password, OTP based authentication.

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable long userId) throws Exception {
        if (userService.existsById(userId)) {
            boolean deleted = userService.deleteById(userId);
            if (deleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Sorry cannot delete an Admin.");
            }
        }
        return ResponseEntity.notFound().build();
    }

}
