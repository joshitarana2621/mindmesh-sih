import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const institution = await prisma.institution.create({
    data: {
      name: "Demo School",
      code: "DEMO-001",
      address: "123 Education Lane",
      email: "admin@demoschool.edu",
    },
  });

  const admin = await prisma.user.create({
    data: {
      institutionId: institution.id,
      name: "Admin User",
      email: "admin@demoschool.edu",
      role: "INSTITUTION_ADMIN",
    },
  });

  const teacher1 = await prisma.user.create({
    data: {
      institutionId: institution.id,
      name: "Priya Sharma",
      email: "priya@demoschool.edu",
      role: "TEACHER",
      teacherProfile: {
        create: { institutionId: institution.id, subject: "Mathematics" },
      },
    },
  });

  const teacher2 = await prisma.user.create({
    data: {
      institutionId: institution.id,
      name: "Rahul Verma",
      email: "rahul@demoschool.edu",
      role: "TEACHER",
      teacherProfile: {
        create: { institutionId: institution.id, subject: "Computer Science" },
      },
    },
  });

  const classroom = await prisma.classroom.create({
    data: {
      institutionId: institution.id,
      name: "Grade 8 - Section A",
      gradeBand: "8",
      subject: "Computer Science",
    },
  });

  await prisma.classroomMember.createMany({
    data: [
      { classroomId: classroom.id, userId: teacher1.id, role: "TEACHER" },
      { classroomId: classroom.id, userId: teacher2.id, role: "ASSISTANT" },
    ],
  });

  const students = [];
  for (let i = 1; i <= 5; i++) {
    const student = await prisma.user.create({
      data: {
        institutionId: institution.id,
        name: `Student ${i}`,
        email: `student${i}@demoschool.edu`,
        role: "STUDENT",
        studentProfile: {
          create: {
            institutionId: institution.id,
            rollNumber: `R${String(i).padStart(3, "0")}`,
            gradeBand: "8",
            language: "en",
          },
        },
      },
    });
    students.push(student);
    await prisma.classroomMember.create({
      data: { classroomId: classroom.id, userId: student.id, role: "STUDENT" },
    });
  }

  const course = await prisma.course.create({
    data: {
      institutionId: institution.id,
      name: "Introduction to Programming",
      code: "CS-801",
    },
  });

  const subject = await prisma.subject.create({
    data: { courseId: course.id, name: "Fundamentals", code: "FUND", language: "en" },
  });

  const chapter = await prisma.chapter.create({
    data: { subjectId: subject.id, name: "Data Structures", order: 1 },
  });

  const topic = await prisma.topic.create({
    data: { chapterId: chapter.id, name: "Arrays", order: 1 },
  });

  const kc1 = await prisma.knowledgeComponent.create({
    data: { topicId: topic.id, code: "KC-001", name: "Array declaration", gradeBand: "8" },
  });
  const kc2 = await prisma.knowledgeComponent.create({
    data: { topicId: topic.id, code: "KC-002", name: "Array indexing", gradeBand: "8" },
  });
  const kc3 = await prisma.knowledgeComponent.create({
    data: { topicId: topic.id, code: "KC-003", name: "Array traversal", gradeBand: "8" },
  });
  const kc4 = await prisma.knowledgeComponent.create({
    data: { topicId: topic.id, code: "KC-004", name: "Array insertion", gradeBand: "8" },
  });

  await prisma.knowledgeComponentPrerequisite.createMany({
    data: [
      { kcId: kc3.id, prerequisiteId: kc2.id, weight: 1.0 },
      { kcId: kc4.id, prerequisiteId: kc1.id, weight: 0.5 },
      { kcId: kc4.id, prerequisiteId: kc2.id, weight: 0.5 },
    ],
  });

  const quiz = await prisma.quiz.create({
    data: {
      institutionId: institution.id,
      classroomId: classroom.id,
      title: "Arrays Quick Check",
      description: "2-minute micro-assessment on arrays",
      language: "en",
      durationMinutes: 2,
      createdBy: teacher1.id,
      status: "PUBLISHED",
    },
  });

  const quizVersion = await prisma.quizVersion.create({
    data: {
      quizId: quiz.id,
      version: 1,
      packageId: `pkg-${quiz.id}-v1`,
      integrityHash: "sha256-demo-hash-v1",
      scoringConfigVersion: "mastery-v1",
    },
  });

  const q1 = await prisma.question.create({
    data: {
      institutionId: institution.id,
      text: "Which keyword is used to declare an array in JavaScript?",
      type: "MULTIPLE_CHOICE",
      difficulty: 0.3,
    },
  });

  const q1v = await prisma.questionVersion.create({
    data: { questionId: q1.id, version: 1, text: q1.text },
  });

  await prisma.questionOption.createMany({
    data: [
      { questionVersionId: q1v.id, text: "var arr = []", isCorrect: true, order: 1 },
      { questionVersionId: q1v.id, text: "array arr = []", isCorrect: false, order: 2, distractorType: "SYNTAX_ERROR" },
      { questionVersionId: q1v.id, text: "let arr = {}", isCorrect: false, order: 3, distractorType: "CONCEPTUAL_ERROR" },
      { questionVersionId: q1v.id, text: "arr = new array()", isCorrect: false, order: 4, distractorType: "SYNTAX_ERROR" },
    ],
  });

  await prisma.questionKnowledgeComponent.create({
    data: { questionVersionId: q1v.id, kcId: kc1.id, weight: 1.0 },
  });

  const q2 = await prisma.question.create({
    data: {
      institutionId: institution.id,
      text: "What is the index of the first element in an array?",
      type: "MULTIPLE_CHOICE",
      difficulty: 0.2,
    },
  });

  const q2v = await prisma.questionVersion.create({
    data: { questionId: q2.id, version: 1, text: q2.text },
  });

  await prisma.questionOption.createMany({
    data: [
      { questionVersionId: q2v.id, text: "0", isCorrect: true, order: 1 },
      { questionVersionId: q2v.id, text: "1", isCorrect: false, order: 2, distractorType: "PREREQUISITE_GAP" },
      { questionVersionId: q2v.id, text: "First", isCorrect: false, order: 3, distractorType: "READING_ERROR" },
    ],
  });

  await prisma.questionKnowledgeComponent.create({
    data: { questionVersionId: q2v.id, kcId: kc2.id, weight: 1.0 },
  });

  const q3 = await prisma.question.create({
    data: {
      institutionId: institution.id,
      text: "Given arr = [10, 20, 30], what is arr[1]?",
      type: "MULTIPLE_CHOICE",
      difficulty: 0.4,
    },
  });

  const q3v = await prisma.questionVersion.create({
    data: { questionId: q3.id, version: 1, text: q3.text },
  });

  await prisma.questionOption.createMany({
    data: [
      { questionVersionId: q3v.id, text: "20", isCorrect: true, order: 1 },
      { questionVersionId: q3v.id, text: "10", isCorrect: false, order: 2, distractorType: "PREREQUISITE_GAP" },
      { questionVersionId: q3v.id, text: "30", isCorrect: false, order: 3, distractorType: "CALCULATION_SLIP" },
    ],
  });

  await prisma.questionKnowledgeComponent.create({
    data: { questionVersionId: q3v.id, kcId: kc2.id, weight: 1.0 },
  });

  await prisma.quizQuestion.createMany({
    data: [
      { quizVersionId: quizVersion.id, questionVersionId: q1v.id, order: 1, points: 1.0 },
      { quizVersionId: quizVersion.id, questionVersionId: q2v.id, order: 2, points: 1.0 },
      { quizVersionId: quizVersion.id, questionVersionId: q3v.id, order: 3, points: 1.0 },
    ],
  });

  for (const student of students) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId: student.id } });
    if (profile) {
      await prisma.quizAttempt.create({
        data: {
          studentId: profile.id,
          quizId: quiz.id,
          quizVersionId: quizVersion.id,
          status: "ASSIGNED",
        },
      });
    }
  }

  console.log("Seed complete:");
  console.log(`  Institution: ${institution.name} (${institution.code})`);
  console.log(`  Teachers: Priya Sharma, Rahul Verma`);
  console.log(`  Students: 5`);
  console.log(`  Classroom: ${classroom.name}`);
  console.log(`  KCs: Array declaration, indexing, traversal, insertion`);
  console.log(`  Quiz: ${quiz.title} with 3 questions`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
