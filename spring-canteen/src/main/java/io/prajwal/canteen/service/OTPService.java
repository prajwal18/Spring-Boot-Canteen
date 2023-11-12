package io.prajwal.canteen.service;


import io.prajwal.canteen.dto.FPasswordDTO;

public interface OTPService {

    void sendOTP(String email) throws  Exception;

    boolean checkOTP(String otp, String email);

    void changePasswordByOTP(FPasswordDTO fPasswordDTO) throws Exception;
}
