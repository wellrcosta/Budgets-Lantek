import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: User; token: string }> {
    try {
      const createDto = { ...registerDto, role: UserRole.USER };
      if (registerDto.organizationName?.trim()) {
        const organization = await this.organizationsService.create({
          name: registerDto.organizationName.trim(),
          description: registerDto.organizationDescription,
        });
        createDto.organizationId = organization.id;
      } else if (registerDto.organizationId) {
        const existing = await this.organizationsService.findById(
          registerDto.organizationId,
        );
        if (!existing) {
          throw new BadRequestException('Organization not found');
        }
      }
      const user = await this.usersService.create(createDto);
      const token = this.generateToken(user);
      return { user, token };
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new ConflictException('Email already exists');
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };
    return this.jwtService.sign(payload);
  }

  async validateUser(userId: number): Promise<User | null> {
    return this.usersService.findById(userId);
  }

  async listOrganizations() {
    return this.organizationsService.findPublic();
  }
}
