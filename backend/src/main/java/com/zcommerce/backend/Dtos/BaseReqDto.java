package com.zcommerce.backend.Dtos;

public sealed interface BaseReqDto extends BaseDto permits LoginReqDto, RegisterReqDto {
}
