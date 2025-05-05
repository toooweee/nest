import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { ITask } from './types/task.interface';
import { Tags } from './types/tags.enum';

@Injectable()
export class TaskService {
  private tasks: ITask[] = [
    {
      id: 1,
      title: 'Learn Nest',
      description: 'Learn nest docs and video',
      priority: 10,
      isCompleted: false,
      tags: [Tags.WORK, Tags.STUDY],
    },
    {
      id: 2,
      title: 'Build API',
      description: 'Build simple crud api',
      priority: 9,
      isCompleted: false,
      tags: [Tags.WORK, Tags.STUDY],
    },
  ];

  lastTaskId = this.tasks.length;

  findAll(): ITask[] {
    return this.tasks;
  }

  create(dto: CreateTaskDto) {
    const task = {
      id: ++this.lastTaskId,
      isCompleted: false,
      ...dto,
    };

    this.tasks.push(task);

    return task;
  }

  findOne(id: number): ITask {
    const taskIndex = this.findTaskIndex(id);

    if (taskIndex === -1) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return this.tasks[taskIndex];
  }

  update(id: number, dto: UpdateTaskDto) {
    const taskIndex = this.findTaskIndex(id);

    if (taskIndex === -1) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    const updatedTask = {
      id,
      title: dto?.title ?? this.tasks[taskIndex].title,
      description: dto?.description ?? this.tasks[taskIndex].description,
      priority: dto?.priority ?? this.tasks[taskIndex].priority,
      tags: dto?.tags ?? this.tasks[taskIndex].tags,
      isCompleted: dto?.isCompleted ?? this.tasks[taskIndex].isCompleted,
    };

    this.tasks[taskIndex] = updatedTask;

    return updatedTask;
  }

  delete(id: number) {
    const taskIndex = this.findTaskIndex(id);

    if (taskIndex === -1) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    const task = this.tasks[taskIndex];

    this.tasks.splice(taskIndex, 1);

    return task;
  }

  private findTaskIndex(id: number): number {
    return this.tasks.findIndex((task) => task.id === id);
  }
}
