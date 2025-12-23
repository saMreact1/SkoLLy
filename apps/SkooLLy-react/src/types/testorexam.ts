export type testCard = {
    subject: string;
    description: string;
}
export type TestType = {
  classId: String;
  className: String;
  isApproved: true;
  subject: String;
  subjectCode: String;
  subjectId: String;
  subjectTest: [
    {
      number: String;
      question: String;
      options: String[];
      question_answer: String;
      question_score: Number;
    }
  ];
  teacherId: String;
  teacherName: String;
  _id: String;
};