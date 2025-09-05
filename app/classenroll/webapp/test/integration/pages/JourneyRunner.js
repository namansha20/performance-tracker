sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"classenroll/classenroll/test/integration/pages/ClassEnrollmentsList",
	"classenroll/classenroll/test/integration/pages/ClassEnrollmentsObjectPage"
], function (JourneyRunner, ClassEnrollmentsList, ClassEnrollmentsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('classenroll/classenroll') + '/index.html',
        pages: {
			onTheClassEnrollmentsList: ClassEnrollmentsList,
			onTheClassEnrollmentsObjectPage: ClassEnrollmentsObjectPage
        },
        async: true
    });

    return runner;
});

