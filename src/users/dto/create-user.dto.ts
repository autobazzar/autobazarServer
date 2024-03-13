import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    userName: string;

    @IsEmail()
    email: string;
}

export class CreateUserGoogleDto {
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