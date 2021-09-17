# Testing process.exit with Jest in NodeJS

## The scenario

Consider you have the following function to be tested with [Jest](https://jestjs.io/):

```javascript
function myFunc() {
    //
    // ...do "stuff"
    //
    if (condition) {
        process.exit(ERROR_CODE);
    }
    //
    // ...do "other stuff"
    //
 }
```

## Setting up the test case

To test the branch where `condition` is `true` you have to mock `process.exit` because otherwise the Jest test process would truly exit and therefore fail. Of course this mocking should have been done in a way that "other stuff" is never executed in this test.

To achieve that we use Jest's `spyOn` to implement a mock for `process.exit` that instead of exiting the process will throw en error.

```javascript
const mockExit = jest.spyOn(process, 'exit')
    .mockImplementation((number) => { throw new Error('process.exit: ' + number); });
```

This ensures that the execution of our function ends immediately without doing "other stuff" and without ending the Jest test process. Also this mock serves to check if `process.exit` really was called and what the exit code was. We do this with Jest's `toHaveBeenCalledWith` test function.

To get the test case up and running we have to wrap our functions execution in an `expect( ... ).toThrow()` statement because it is now throwing an error by using the mock. Also it is a good practice to restore the original mocked function by calling `mockRestore` to avoid unintended side-effects.

So we have our final test case looking like that:

```javascript
it('tests myFunc with process.exit', async () => {
    const mockExit = jest.spyOn(process, 'exit')
        .mockImplementation((number) => { throw new Error('process.exit: ' + number); });
    expect(() => {
        myFunc(true);
    }).toThrow();
    expect(mockExit).toHaveBeenCalledWith(-1);
    mockExit.mockRestore();
});
```

## Try it out

```
npm install
npm run test
```

Happy testing ;)