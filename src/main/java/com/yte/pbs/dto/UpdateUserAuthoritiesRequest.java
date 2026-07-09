package com.yte.pbs.dto;

import lombok.Data;
import java.util.List;

@Data
public class UpdateUserAuthoritiesRequest {
    private List<UserAuthorityDto> users;
}
