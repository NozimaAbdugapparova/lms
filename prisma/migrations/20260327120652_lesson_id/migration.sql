/*
  Warnings:

  - You are about to drop the column `course_id` on the `LessonView` table. All the data in the column will be lost.
  - Added the required column `lesson_id` to the `LessonView` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LessonView" DROP CONSTRAINT "LessonView_course_id_fkey";

-- AlterTable
ALTER TABLE "LessonView" DROP COLUMN "course_id",
ADD COLUMN     "courseId" INTEGER,
ADD COLUMN     "lesson_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "LessonView" ADD CONSTRAINT "LessonView_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
