import { IsEmail, IsNotEmpty, IsOptional, ValidateIf } from "class-validator";

export class CreateUserDto {
    isFromGoogle:boolean;

    @ValidateIf(object=>object.isForGoogle)
    @IsNotEmpty()
    password: string;

    @ValidateIf(object=>object.isForGoogle)
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