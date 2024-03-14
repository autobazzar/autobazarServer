import { IsEmail, IsNotEmpty, ValidateIf } from "class-validator";

export class CreateUserDto {
    isFromGoogle: boolean;

    @ValidateIf((object,) => {
        return !object.isFromGoogle
    })
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    userName: string;

    @IsEmail()
    email: string;
}

export class LoginUserDto {
    isFromGoogle?: boolean;

    @ValidateIf((object,) => {
        return !object.isFromGoogle
    })
    @IsNotEmpty()
    password: string;

    @IsEmail()
    email: string;
}