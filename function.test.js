const myFunc = require('./function').myFunc;

describe('jest-process-exit test suite', () => {

    var testOutput = [];
    const originalConsoleLog = console.log;
    const testConsoleLog = (output) => { testOutput.push(output) };

    beforeEach(() => {
        console.log = testConsoleLog;
        testOutput = [];

    });

    afterEach(() => {
        console.log = originalConsoleLog;
    });

    it('tests myFunc with process.exit', async (done) => {
        const mockExit = jest.spyOn(process, 'exit')
            .mockImplementation((number) => { throw new Error('process.exit: ' + number); });
        expect(() => {
            myFunc(true);
        }).toThrow();
        expect(mockExit).toHaveBeenCalledWith(-1);
        mockExit.mockRestore();
        expect(testOutput.length).toBe(1);
        expect(testOutput[0]).toBe('before');
        done();
    });

    it('tests myFunc without process.exit', async (done) => {
        myFunc(false);
        expect(testOutput.length).toBe(2);
        expect(testOutput[0]).toBe('before');
        expect(testOutput[1]).toBe('after');
        done();
    });

});