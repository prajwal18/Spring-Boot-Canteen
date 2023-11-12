package io.prajwal.canteen.controller;

import io.prajwal.canteen.dto.FPasswordDTO;
import io.prajwal.canteen.service.OTPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class OTPController {

    @Autowired
    private OTPService otpService;

    // Send OTP to email
    @PostMapping("/otp/send")
    public ResponseEntity<Void> sendOTP(@RequestBody FPasswordDTO fPasswordDTO) {
        // Only the email value of the dto will be used here
        try{
        otpService.sendOTP(fPasswordDTO.getEmail());
        return ResponseEntity.noContent().build();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Verify OTP
    @PostMapping("/otp/check")
    public ResponseEntity<Void> checkOTP(@RequestBody FPasswordDTO fPasswordDTO){
        // Only the otp & email value of the dto will be used here
        boolean isCorrect = otpService.checkOTP(fPasswordDTO.getOtp(), fPasswordDTO.getEmail());

        if(isCorrect){
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    // Change Password
    @PutMapping("/otp/change-password")
    public ResponseEntity<Void> changePassword(@RequestBody FPasswordDTO fPasswordDTO){
        try {
            otpService.changePasswordByOTP(fPasswordDTO);
            return ResponseEntity.noContent().build();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }
    }
}
