package io.prajwal.canteen.service.impl;

import io.prajwal.canteen.dto.FPasswordDTO;
import io.prajwal.canteen.model.OTP;
import io.prajwal.canteen.model.UserEntity;
import io.prajwal.canteen.repository.OTPReository;
import io.prajwal.canteen.repository.UserRepository;
import io.prajwal.canteen.service.OTPService;
import io.prajwal.canteen.util.OTPGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class OTPServiceImpl implements OTPService {


    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OTPReository otpRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private MailSenderService mailService;

    @Override
    public void sendOTP(String email) throws Exception {
        String otp = OTPGenerator.generateOTP();
        String encodedOTP = encoder.encode(otp);
        UserEntity user = userRepository.findFirstByEmail(email);
        if (user != null) {
            OTP otp_entity = otpRepository.findByUserEmail(email);
            LocalDateTime expirationDate = LocalDateTime.now().plusMinutes(5);
            OTP newOTP = OTP.builder()
                    .otp(encodedOTP)
                    .user(user)
                    .validTill(expirationDate)
                    .build();
            // Time to send a mail;
            String resetPasswordBody = mailService.resetPasswordBody(otp);
            if(otp_entity != null){
                newOTP.setId(otp_entity.getId());
            }
            otpRepository.save(newOTP);
            mailService.sendNewMail(email, "Password Reset - OTP Code", resetPasswordBody);

        } else {
            throw new Exception("User does not exist");
        }

    }

    @Override
    public boolean checkOTP(String otp, String email) {
        OTP otp_entity = otpRepository.findByUserEmail(email);
        if (otp_entity != null) {
            return encoder.matches(otp, otp_entity.getOtp());
        }
        return false;
    }

    @Override
    public void changePasswordByOTP(FPasswordDTO fPasswordDTO) throws Exception {
        OTP otp = otpRepository.findByUserEmail(fPasswordDTO.getEmail());
        if (otp != null) {
            // Check if the otp stored in the DB is expired
            LocalDateTime currentTime = LocalDateTime.now();
            boolean otpIsValid = currentTime.isBefore(otp.getValidTill());

            if (otpIsValid) {
                // Check if otp value provided by user and the one stored in the DB match;
                String encodedDbOtp = otp.getOtp();
                String rawOtp = fPasswordDTO.getOtp();
                boolean match = encoder.matches(rawOtp, encodedDbOtp);
                if (match) {
                    UserEntity user = userRepository.findFirstByEmail(fPasswordDTO.getEmail());
                    String newPassword = encoder.encode(fPasswordDTO.getNewPassword());
                    user.setPassword(newPassword);
                    userRepository.save(user);
                    return;
                }
            }
        }
        throw new Exception("OTP validation error.");
    }
}
