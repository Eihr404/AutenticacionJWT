import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  // Simulamos base de datos con un array
  private users: User[] = [];
  private idCounter = 1;

  // Crear nuevo usuario
  create(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      id: this.idCounter++,
      ...userData,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  // Buscar usuario por email
  findByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  // Buscar usuario por ID
  findById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  // Obtener todos los usuarios (sin contraseñas)
  findAll(): Omit<User, 'password'>[] {
    return this.users.map(({ password, ...user }) => user);
  }

  // Buscar un usuario por ID (sin contraseña)
  findOne(id: number): Omit<User, 'password'> | undefined {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      return undefined;
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Actualizar usuario
  update(id: number, updateUserDto: UpdateUserDto): Omit<User, 'password'> | undefined {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return undefined;
    }

    // Actualizar los campos proporcionados
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
    };

    const { password, ...userWithoutPassword } = this.users[userIndex];
    return userWithoutPassword;
  }

  // Eliminar usuario
  remove(id: number): { success: boolean; message: string } {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    this.users.splice(userIndex, 1);
    return { success: true, message: 'Usuario eliminado exitosamente' };
  }
}