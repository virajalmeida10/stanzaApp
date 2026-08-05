package com.almeida.viraj01.projects.stanzaApp.util;

import com.almeida.viraj01.projects.stanzaApp.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;

public class AppUtils {

    public static User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
