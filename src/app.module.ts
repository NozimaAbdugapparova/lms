import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { MentorProfileModule } from './modules/mentor-profile/mentor-profile.module';
import { CourseModule } from './modules/course/course.module';
import { CourseCategoryModule } from './modules/course-category/course-category.module';
import { AssignedCourseModule } from './modules/assigned-course/assigned-course.module';
import { PurchasedCourseModule } from './modules/purchased-course/purchased-course.module';
import { RatingService } from './modules/rating/rating.service';
import { RatingModule } from './modules/rating/rating.module';
import { LastActivityModule } from './modules/last-activity/last-activity.module';
import { SectionLessonModule } from './modules/section-lesson/section-lesson.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { LessonViewModule } from './modules/lesson-view/lesson-view.module';
import { LessonFileModule } from './modules/lesson-file/lesson-file.module';
import { HomeworkModule } from './modules/homework/homework.module';
import { PrismaModule } from './core/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CloudinaryModule } from 'nestjs-cloudinary';
import { RedisModule } from './core/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true
    }),
    CloudinaryModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService : ConfigService)=> ({
            cloud_name: configService.get<string>('CLOUD_NAME'),
            api_key: configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
            resource_type: "auto"
        })
    }),
    AuthModule,
    UsersModule,
    MentorProfileModule,
    CourseCategoryModule,
    CourseModule,
    AssignedCourseModule,
    PurchasedCourseModule,
    RatingModule,
    LastActivityModule,
    SectionLessonModule,
    LessonModule,
    LessonViewModule,
    LessonFileModule,
    HomeworkModule,
    PrismaModule,
    RedisModule,
  ],
  providers: [RatingService],
})
export class AppModule {}
