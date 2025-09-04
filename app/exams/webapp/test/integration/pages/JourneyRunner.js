sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"exams/exams/test/integration/pages/ExamsList",
	"exams/exams/test/integration/pages/ExamsObjectPage",
	"exams/exams/test/integration/pages/PerformanceMetricsObjectPage"
], function (JourneyRunner, ExamsList, ExamsObjectPage, PerformanceMetricsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('exams/exams') + '/index.html',
        pages: {
			onTheExamsList: ExamsList,
			onTheExamsObjectPage: ExamsObjectPage,
			onThePerformanceMetricsObjectPage: PerformanceMetricsObjectPage
        },
        async: true
    });

    return runner;
});

