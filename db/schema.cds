namespace com.college.performance;

using { cuid, managed } from '@sap/cds/common';

entity Students : cuid, managed {
    firstName      : String(100) not null;
    lastName       : String(100) not null;
    dateOfBirth    : Date;
    email          : String(255) @assert.unique;
    enrollmentID   : String(50) @assert.unique;
    enrollments    : Association to many ClassEnrollments on enrollments.student = $self;
    attendanceRecords : Association to many AttendanceRecords on attendanceRecords.student = $self;
    // Calculated field for GPA
    gpa            : Decimal(3, 2) @readonly;
}

entity Teachers : cuid, managed {
    firstName      : String(100) not null;
    lastName       : String(100) not null;
    email          : String(255) @assert.unique;
    employeeID     : String(50) @assert.unique;
    department     : String(100);
    classesTaught  : Association to many Classes on classesTaught.teacher = $self;
}

entity Classes : cuid, managed {
    title          : String(150) not null;
    classCode      : String(20) @assert.unique;
    description    : LargeString;
    teacher        : Association to Teachers;
    enrollments    : Association to many ClassEnrollments on enrollments.class = $self;
    exams          : Association to many Exams on exams.class = $self;
}

entity Exams : cuid, managed {
    title          : String(100) not null;
    examDate       : DateTime;
    maxScore       : Integer default 100 @assert.range: [1, 200];
    class          : Association to Classes;
    scores         : Association to many PerformanceMetrics on scores.exam = $self;
    // Calculated fields
    averageScore   : Decimal(5, 2) @readonly;
    passRate       : Decimal(5, 2) @readonly; // Percentage of students who passed
}

entity ClassEnrollments : cuid, managed {
    student        : Association to Students not null;
    class          : Association to Classes not null;
    enrollmentDate : Date;
}

entity PerformanceMetrics : cuid, managed {
    student        : Association to Students not null;
    exam           : Association to Exams not null;
    score          : Decimal(5, 2) @assert.range: [0, 100] not null;
    comments       : LargeString;
    grade          : String(2) @readonly; // A+, A, B+, B, C+, C, D, F
}

entity AttendanceRecords : cuid, managed {
    student        : Association to Students not null;
    class          : Association to Classes not null;
    date           : Date not null;
    status         : String(10) @assert.range enum {
        Present = 'Present';
        Absent  = 'Absent';
        Late    = 'Late';
        Excused = 'Excused';
    };
    remarks        : String(255);
}






