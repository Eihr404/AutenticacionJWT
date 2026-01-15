import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;
    //
    @IsEmail({}, { message: 'Debe proporcionar un email válido' })
    email: string;
    //
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;
}