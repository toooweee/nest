import { Tags } from './tags.enum';

export interface ITask {
  id: number;
  title: string;
  description: string;
  priority: number;
  tags: Tags[];
  isCompleted: boolean;
}
