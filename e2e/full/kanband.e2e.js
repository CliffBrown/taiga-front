var utils = require('../utils');
var kanbanHelper = require('../helpers').kanban;
var backlogHelper = require('../helpers').backlog;

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('kanban', function() {
    before(async function() {
        browser.get('http://localhost:9001/project/project-0/kanban');

        await utils.common.waitLoader();

        utils.common.takeScreenshot('kanban', 'kanban');
    });

    describe('create us', function() {
        let createUSLightbox = null;
        let formFields = {};

        before(async function() {
            kanbanHelper.openNewUsLb(0);

            createUSLightbox = backlogHelper.getCreateEditUsLightbox();

            await createUSLightbox.waitOpen();
        });

        it('capture screen', function() {
            utils.common.takeScreenshot('kanban', 'create-us');
        });

        it('fill form', async function() {
            let date = Date.now();

            formFields.subject = 'test subject' + date;
            formFields.description = 'test description' + date;

            // subject
            createUSLightbox.subject().sendKeys(formFields.subject);

            // roles
            createUSLightbox.setRole(1, 3);
            createUSLightbox.setRole(2, 3);
            createUSLightbox.setRole(3, 3);
            createUSLightbox.setRole(4, 3);

            let totalPoints = await createUSLightbox.getRolePoints();

            expect(totalPoints).to.be.equal('4');

            // tags
            createUSLightbox.tags().sendKeys('www');
            browser.actions().sendKeys(protractor.Key.ENTER).perform();

            createUSLightbox.tags().sendKeys('xxx');
            browser.actions().sendKeys(protractor.Key.ENTER).perform();

            // description
            createUSLightbox.description().sendKeys(formFields.description);

            //settings
            createUSLightbox.settings(1).click();
        });

        it('send form', async function() {
            createUSLightbox.submit();

            await utils.lightbox.close(createUSLightbox.el);

            let ussTitles = await kanbanHelper.getColumnUssTitles(0);

            let findSubject = ussTitles.indexOf(formFields.subject) !== 1;

            expect(findSubject).to.be.true;
        });
    });


    describe('edit us', function() {
        let createUSLightbox = null;
        let formFields = {};

        before(async function() {
            kanbanHelper.editUs(0, 0);

            createUSLightbox = backlogHelper.getCreateEditUsLightbox();

            await createUSLightbox.waitOpen();
        });

        it('capture screen', function() {
            utils.common.takeScreenshot('kanban', 'edit-us');
        });

        it('fill form', async function() {
            let date = Date.now();

            formFields.subject = 'test subject' + date;
            formFields.description = 'test description' + date;

            // subject
            let subject = createUSLightbox.subject();
            utils.common.clear(subject);
            subject.sendKeys(formFields.subject);

            // roles
            createUSLightbox.setRole(1, 3);
            createUSLightbox.setRole(2, 3);
            createUSLightbox.setRole(3, 3);
            createUSLightbox.setRole(4, 3);

            let totalPoints = await createUSLightbox.getRolePoints();

            expect(totalPoints).to.be.equal('4');

            // tags
            createUSLightbox.tags().sendKeys('www');
            browser.actions().sendKeys(protractor.Key.ENTER).perform();

            createUSLightbox.tags().sendKeys('xxx');
            browser.actions().sendKeys(protractor.Key.ENTER).perform();

            // description
            createUSLightbox.description().sendKeys(formFields.description);

            //settings
            createUSLightbox.settings(1).click();
        });

        it('send form', async function() {
            createUSLightbox.submit();

            await utils.lightbox.close(createUSLightbox.el);

            let ussTitles = await kanbanHelper.getColumnUssTitles(0);

            let findSubject = ussTitles.indexOf(formFields.subject) !== -1;

            expect(findSubject).to.be.true;
        });
    });

    describe('bulk create', function() {
        let createUSLightbox;

        before(async function() {
            kanbanHelper.openBulkUsLb(0);

            createUSLightbox = backlogHelper.getBulkCreateLightbox();

            await createUSLightbox.waitOpen();
        });

        it('fill form', function() {
            createUSLightbox.textarea().sendKeys('aaa');
            browser.actions().sendKeys(protractor.Key.ENTER).perform();

            createUSLightbox.textarea().sendKeys('bbb');
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        });

        it('send form', async function() {
            let ussCount = await kanbanHelper.getBoxUss(0).count();

            createUSLightbox.submit();

            await utils.lightbox.close(createUSLightbox.el);

            let newUssCount = await kanbanHelper.getBoxUss(0).count();

            expect(newUssCount).to.be.equal(ussCount + 2);
        });
    });

    describe.only('folds', function() {
        it('fold column', async function() {
            kanbanHelper.foldColumn(0);

            utils.common.takeScreenshot('kanban', 'fold-column');

            let foldedColumns = await $$('.vfold.task-column').count();

            expect(foldedColumns).to.be.equal(1);
        });

        it('unfold column', async function() {
            kanbanHelper.unFoldColumn(0);

            let foldedColumns = await $$('.vfold.task-column').count();

            expect(foldedColumns).to.be.equal(0);
        });

        it('fold cars', async function() {
            kanbanHelper.foldCards(0);

            utils.common.takeScreenshot('kanban', 'fold-cards');

            let minimized = await $$('.kanban-task-minimized').count();

            expect(minimized).to.be.above(1);
        });

        it('unfold cars', async function() {
            kanbanHelper.unFoldCards(0);

            let minimized = await $$('.kanban-task-minimized').count();

            expect(minimized).to.be.equal(0);
        });
    });

    // describe('folds', function() {
    //     it('fold row', async function() {
    //         taskboardHelper.foldRow(0);

    //         utils.common.takeScreenshot('taskboard', 'fold-row');

    //         let rowsFold = await $$('.row-fold').count();

    //         expect(rowsFold).to.be.equal(1);
    //     });

    //     it('unfold row', async function() {
    //         taskboardHelper.unFoldRow(0);

    //         let rowsFold = await $$('.row-fold').count();

    //         expect(rowsFold).to.be.equal(0);
    //     });

    //     it('fold column', async function() {
    //         taskboardHelper.foldColumn(0);

    //         utils.common.takeScreenshot('taskboard', 'fold-column');

    //         let columnFold = await $$('.column-fold').count();

    //         expect(columnFold).to.be.above(1);
    //     });

    //     it('unfold column', async function() {
    //         taskboardHelper.unFoldColumn(0);

    //         let columnFold = await $$('.column-fold').count();

    //         expect(columnFold).to.be.equal(0);
    //     });

    //     it('fold row and column', async function() {
    //         taskboardHelper.foldRow(0);
    //         taskboardHelper.foldColumn(0);

    //         utils.common.takeScreenshot('taskboard', 'fold-column-row');

    //         let rowsFold = await $$('.row-fold').count();
    //         let columnFold = await $$('.column-fold').count();

    //         expect(rowsFold).to.be.equal(1);
    //         expect(columnFold).to.be.above(1);
    //     });

    //     it('unfold row and column', async function() {
    //         taskboardHelper.unFoldRow(0);
    //         taskboardHelper.unFoldColumn(0);

    //         let rowsFold = await $$('.row-fold').count();
    //         let columnFold = await $$('.column-fold').count();

    //         expect(rowsFold).to.be.equal(0);
    //         expect(columnFold).to.be.equal(0);
    //     });
    // });

    // describe('move tasks', function() {
    //     it('move task between statuses', async function() {
    //         let initOriginTaskCount = await taskboardHelper.getBoxTasks(0, 0).count();
    //         let initDestinationTaskCount = await taskboardHelper.getBoxTasks(0, 1).count();

    //         let taskOrigin = taskboardHelper.getBoxTasks(0, 0).first();
    //         let destination = taskboardHelper.getBox(0, 1);

    //         await utils.common.drag(taskOrigin, destination);

    //         browser.waitForAngular();

    //         let originTaskCount = await taskboardHelper.getBoxTasks(0, 0).count();
    //         let destinationTaskCount = await taskboardHelper.getBoxTasks(0, 1).count();

    //         expect(originTaskCount).to.be.equal(initOriginTaskCount - 1);
    //         expect(destinationTaskCount).to.be.equal(initDestinationTaskCount + 1);
    //     });

    //     // jquery ui drag bug
    //     it.skip('move task between US\s', async function() {
    //         let initOriginTaskCount = await taskboardHelper.getBoxTasks(0, 0).count();
    //         let initDestinationTaskCount = await taskboardHelper.getBoxTasks(1, 1).count();

    //         let taskOrigin = taskboardHelper.getBoxTasks(0, 0).first();
    //         let destination = taskboardHelper.getBox(1, 0);

    //         await utils.common.drag(taskOrigin, destination);

    //         browser.waitForAngular();

    //         let originTaskCount = await taskboardHelper.getBoxTasks(0, 0).count();
    //         let destinationTaskCount = await taskboardHelper.getBoxTasks(1, 1).count();

    //         expect(originTaskCount).to.be.equal(initOriginTaskCount - 1);
    //         expect(destinationTaskCount).to.be.equal(initDestinationTaskCount + 1);
    //     });
    // });


    // it.skip('Change task assigned to', function(){});

    // describe('Graph', function(){
    //     let graph = $('.graphics-container');

    //     it('open', async function() {
    //         taskboardHelper.toggleGraph();

    //         await utils.common.waitTransitionTime(graph);

    //         utils.common.takeScreenshot('taskboard', 'grap-open');

    //         let open = await utils.common.hasClass(graph, 'open');

    //         expect(open).to.be.true;
    //     });

    //     it('close', async function() {
    //         taskboardHelper.toggleGraph();

    //         await utils.common.waitTransitionTime(graph);

    //         let open = await utils.common.hasClass(graph, 'open');

    //         expect(open).to.be.false;
    //     });
    // });
});
