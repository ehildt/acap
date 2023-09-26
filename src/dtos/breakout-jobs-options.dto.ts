import { ApiProperty } from '@nestjs/swagger';
import { BackoffOptions, JobsOptions, KeepJobs, RepeatOptions } from 'bullmq';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { DateType } from 'cron-parser';

class BullBackoffOptions implements BackoffOptions {
  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  delay?: number;

  @IsString()
  @ApiProperty({ enum: ['fixed', 'exponential'] })
  type: 'fixed' | 'exponential' | string;
}

class BullKeepJobs implements KeepJobs {
  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  age?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  count?: number;
}

class BullParent {
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  queue: string;
}

class BullRepeatOptions implements RepeatOptions {
  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  count?: number;

  @IsOptional()
  @IsDate()
  @ApiProperty({ type: Date, required: false })
  currentDate?: DateType;

  @IsOptional()
  @IsDate()
  @ApiProperty({ type: Date, required: false })
  endDate?: DateType;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  every?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  immediately?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  jobId?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  limit?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  nthDayOfWeek?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  offset?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  pattern?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  prevMillis?: number;

  @IsOptional()
  @IsDate()
  @ApiProperty({ required: false, type: () => Date })
  startDate?: DateType;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  tz?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  utc?: boolean;
}

export class BullMQJobsOptions implements JobsOptions {
  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  attempts?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  delay?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  failParentOnFailure?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  jobId?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  keepLogs?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  lifo?: boolean;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  prevMillis?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  priority?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  removeDependencyOnFailure?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  repeatJobKey?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  sizeLimit?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  stackTraceLimit?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  timestamp?: number;

  @IsOptional()
  @Type(() => BullBackoffOptions)
  @ApiProperty({ required: false, type: () => BullBackoffOptions })
  backoff?: number | BullBackoffOptions;

  @IsOptional()
  @Type(() => BullParent)
  @ApiProperty({ type: () => BullParent, required: false })
  parent?: BullParent;

  @IsOptional()
  @ApiProperty({ type: BullKeepJobs, required: false })
  removeOnComplete?: number | boolean | BullKeepJobs;

  @IsOptional()
  @ApiProperty({ type: BullKeepJobs, required: false })
  removeOnFail?: number | boolean | BullKeepJobs;

  @IsOptional()
  @Type(() => BullRepeatOptions)
  @ApiProperty({ required: false })
  repeat?: BullRepeatOptions;
}
