import { IsEmail, IsNotEmpty, IsOptional, ValidateIf } from "class-validator";
import { error } from "console";

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
    @IsNotEmpty()
    password: string;

    @IsEmail()
    email: string;
}

export class LoginWithGoogleDto {
    @IsEmail()
    email: string;
}