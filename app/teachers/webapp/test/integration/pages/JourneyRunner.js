sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"fioriui/teachers/test/integration/pages/TeachersList",
	"fioriui/teachers/test/integration/pages/TeachersObjectPage",
	"fioriui/teachers/test/integration/pages/ClassesObjectPage"
], function (JourneyRunner, TeachersList, TeachersObjectPage, ClassesObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('fioriui/teachers') + '/index.html',
        pages: {
			onTheTeachersList: TeachersList,
			onTheTeachersObjectPage: TeachersObjectPage,
			onTheClassesObjectPage: ClassesObjectPage
        },
        async: true
    });

    return runner;
});

