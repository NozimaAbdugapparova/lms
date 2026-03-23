import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { MentorProfileModule } from './modules/mentor-profile/mentor-profile.module';
import { CourseModule } from './modules/course/course.module';
import { CourseCategoryModule } from './modules/course-category/course-category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true
    }),
    UsersModule,
    MentorProfileModule,
    CourseModule,
    CourseCategoryModule
  ],
})
export class AppModule {}
