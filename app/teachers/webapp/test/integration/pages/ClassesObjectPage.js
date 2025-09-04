sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'fioriui.teachers',
            componentId: 'ClassesObjectPage',
            contextPath: '/Teachers/classesTaught'
        },
        CustomPageDefinitions
    );
});