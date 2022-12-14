import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

import {Logger} from '@nestjs/common'
import { ConfigService } from '@nestjs/config';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private tasksService: TasksService, configService: ConfigService) {
    console.log(configService.get('TEST_VALUE'))
  }

    @Get()
    getAllTasks(
      @Query(ValidationPipe) filterDto: GetTasksFilterDto,
      @GetUser() user: User
    ): Promise<Task[]> {
      this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`)
     return this.tasksService.getAllTasks(filterDto, user)
    }

    @Get('/:id')
    getTaskById(
      @Param('id')
      id: string,
      @GetUser() user: User,
      ): Promise<Task> {
      return this.tasksService.getTaskById(id, user);
    }


    @Post()
    @UsePipes(ValidationPipe)
    createTask(
      @Body() createTaskDto: CreateTaskDto,
      @GetUser() user: User
      ): Promise<Task> {
        this.logger.verbose(`User "${user.username}" create a new task. Data: ${JSON.stringify(createTaskDto)}`)
      return this.tasksService.createTask(createTaskDto, user)
    }


    @Delete('/:id')
    deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
      return this.tasksService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id') id: string,  @GetUser() user: User, @Body('status', TaskStatusValidationPipe) status: TaskStatus): Promise<Task> {
      return this.tasksService.updateTaskStatus(id, status, user)
    }
}
