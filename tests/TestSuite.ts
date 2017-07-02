module UnitTests {
    export class TestSuite {

        constructor() {
        }

        public run() : void {
            var simpleLogicTest = new tsUnit.Test(UnitTests.SimpleMapLogicTest);
            simpleLogicTest.run().showResults(document.getElementById('unit_tests'));
        }

    }
}    