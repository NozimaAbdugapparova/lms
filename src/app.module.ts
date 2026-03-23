import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true
    }),
    UsersModule,
    MentorProfileModule,
    CourseModule,
    CourseCategoryModule,
    AssignedCourseModule,
    PurchasedCourseModule,
    RatingModule,
    LastActivityModule,
    SectionLessonModule,
    LessonModule,
    LessonViewModule,
    LessonFileModule,
    HomeworkModule,
    PrismaModule
  ],
  providers: [RatingService],
})
export class AppModule {}
