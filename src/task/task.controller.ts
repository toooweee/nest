import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { ITask } from './types/task.interface';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAll(): ITask[] {
    return this.taskService.findAll();
  }

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.taskService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): ITask | unknown {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto): ITask | unknown {
    return this.taskService.update(+id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.taskService.delete(+id);
  }
}
