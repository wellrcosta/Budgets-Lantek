import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createDto: CreateItemDto): Promise<Item> {
    const item = this.itemRepository.create(createDto);
    return this.itemRepository.save(item);
  }

  async findAll(organizationId?: number): Promise<Item[]> {
    if (organizationId) {
      return this.itemRepository.find({
        where: { organizationId },
        relations: ['organization'],
      });
    }
    return this.itemRepository.find({
      relations: ['organization'],
    });
  }

  async findById(id: number): Promise<Item | null> {
    return this.itemRepository.findOne({
      where: { id },
      relations: ['organization'],
    });
  }

  async update(id: number, updateDto: UpdateItemDto): Promise<Item> {
    const item = await this.findById(id);
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    Object.assign(item, updateDto);
    return this.itemRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const result = await this.itemRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Item not found');
    }
  }
}
