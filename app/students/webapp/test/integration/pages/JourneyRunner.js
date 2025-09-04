sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"students/test/integration/pages/StudentsList",
	"students/test/integration/pages/StudentsObjectPage",
	"students/test/integration/pages/ClassEnrollmentsObjectPage"
], function (JourneyRunner, StudentsList, StudentsObjectPage, ClassEnrollmentsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('students') + '/index.html',
        pages: {
			onTheStudentsList: StudentsList,
			onTheStudentsObjectPage: StudentsObjectPage,
			onTheClassEnrollmentsObjectPage: ClassEnrollmentsObjectPage
        },
        async: true
    });

    return runner;
});

