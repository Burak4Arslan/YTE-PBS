package com.yte.pbs.controller;

import com.yte.pbs.entity.Authority;
import com.yte.pbs.entity.UserProject;
import com.yte.pbs.repository.AuthorityRepository;
import com.yte.pbs.repository.UserProjectRepository;
import com.yte.pbs.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;


    @RestController
    @RequestMapping("/api/user-projects")
    public class UserProjectController {

        private final UserRepository userRepository;
        private final UserProjectRepository userProjectRepository;

        public UserProjectController(UserRepository userRepository, UserProjectRepository userProjectRepository) {
            this.userRepository = userRepository;
            this.userProjectRepository = userProjectRepository;
        }

        @GetMapping
        public List<UserProject> getUserProjects(@RequestParam String email ) {
            var user=userRepository.findByEmail(email);
            if(user.isPresent()){
                long userId=user.get().getId();
               return userProjectRepository.findByUserId(userId);
            }
            return List.of() ;
        }
    }

