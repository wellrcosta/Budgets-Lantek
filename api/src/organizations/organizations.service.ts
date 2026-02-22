import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async create(createDto: CreateOrganizationDto): Promise<Organization> {
    const organization = this.organizationRepository.create(createDto);
    return this.organizationRepository.save(organization);
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationRepository.find({
      relations: ['users', 'budgets'],
    });
  }

  async findById(id: number): Promise<Organization | null> {
    return this.organizationRepository.findOne({
      where: { id },
      relations: ['users', 'budgets', 'items'],
    });
  }

  async update(id: number, updateDto: UpdateOrganizationDto): Promise<Organization> {
    const organization = await this.findById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    Object.assign(organization, updateDto);
    return this.organizationRepository.save(organization);
  }

  async remove(id: number): Promise<void> {
    const result = await this.organizationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Organization not found');
    }
  }
}
