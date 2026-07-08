package com.yte.pbs.controller;

import com.yte.pbs.entity.UserProject;
import com.yte.pbs.repository.UserProjectRepository;
import com.yte.pbs.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


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





    @GetMapping("/{personelId}")
    public ResponseEntity<List<UserProject>> getUserProjects(@PathVariable Long personelId) {

        List<UserProject> projects = null;
        var user=userRepository.findById(personelId);
        if(user.isPresent()){
            long userId=user.get().getId();
            projects = userProjectRepository.findByUserId(userId);
        }


        return ResponseEntity.ok(projects);
    }

}
