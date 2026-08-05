package com.almeida.viraj01.projects.stanzaApp.service;

import com.almeida.viraj01.projects.stanzaApp.dto.ProfileUpdateRequestDto;
import com.almeida.viraj01.projects.stanzaApp.dto.UserDto;
import com.almeida.viraj01.projects.stanzaApp.entity.User;

public interface UserService {

    User getUserById(Long id);

    void updateProfile(ProfileUpdateRequestDto profileUpdateRequestDto);

    UserDto getMyProfile();
}
