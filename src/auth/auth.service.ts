import {
    Injectable,
    ConflictException,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from '../users/dto/register.dto';
import { LoginDto } from '../users/dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    /**
     * REGISTRO DE USUARIO
     * 1. Verifica que el email no exista
     * 2. Hashea la contraseña
     * 3. Crea el usuario
     * 4. Retorna usuario sin contraseña
     * 5. algo mas? esta bien este algoritmo?
     */
    async register(registerDto: RegisterDto) {

        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const user = this.usersService.create({
            name: registerDto.name,
            email: registerDto.email,
            password: hashedPassword
        });

        const { password, ...userWithoutPassword } = user;
        return {
            message: 'Usuario registrado exitosamente',
            user: userWithoutPassword
        };
    }


    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        // 3. Comparar password
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }


        // 5. Generar JWT
        const payload = {
            sub: user.id,      // "subject" (ID del usuario)
            email: user.email,
            name: user.name
        };
        const access_token = this.jwtService.sign(payload);
        // 6. Retornar
        const { password, ...userWithoutPassword } = user;
        return {
            message: 'Login exitoso',
            access_token,
            user: userWithoutPassword
        };
    }

    /**
     * OBTENER PERFIL
     * Retorna información del usuario autenticado
     */
    async getProfile(userId: number) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}